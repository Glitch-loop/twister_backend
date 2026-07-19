// Libraries
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

// Repository
import { WorkDayRepository } from '@/src/business-operation-route/core/interfaces/work-day.repository';
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

// Aggregate
import { BusinessOperationDayAggregate } from '@/src/business-operation-route/core/aggregates/business-operation-day.aggregate';
import { WorkDayAggregate } from '@/src/business-operation-route/core/aggregates/work-day.aggregate';

// Enums
import { DAY_OPERATIONS_ENUM } from '@/src/business-operation-route/core/enums/day-operations.enum';
import { WorkDayEntity } from '@/src/business-operation-route/core/entities/work-day.entity';

// Errors
import { BusinessRuleException } from '@/src/shared/errors/BusinessRuleException';

//Entity
import { WorkDayOperationHistoricEntity } from '@/src/business-operation-route/core/entities/work-day-operation-historic.entity';

// Mapper
import { Mapper } from '@/src/business-operation-route/application/mappers/entity-dto.mapper';

// External modules
import { RouteRepository } from '@/src/route-organization/core/interfaces/route.repository';
import { RouteDayEntity } from '@/src/route-organization/core/entities/route-day.entity';
import { OrganizationStrategyEntity } from '@/src/route-organization/core/entities/organization-strategy.entity';
import { RouteOrganizationStrategyAggregate } from '@/src/route-organization/core/aggregates/route-organization-strategy.aggregate';
import { ROUTE_ORGANIZATION_STRATEGIES_ENUM } from '@/src/route-organization/core/enums/route-organization-strategies.enum';
import { RouteDayLocationObjectValue } from '@/src/route-organization/core/value-objects/route-day-location.object-value';
import { OrganizeRouteDayCommand } from '@/src/route-organization/application/commands/organize-route-day.command';
import { DOMAIN_EVENT_ENUM } from '@/src/shared/core/enums/domain-event.enum';
import { ConfirmedClientEvent } from '@/src/shared/events/interfaces/confirmed-client-event.interface';

@Injectable()
export class RegisterWorkDayBusinessOperationsCommand {
	constructor(
		@Inject(WorkDayRepository) private readonly workDayRepository: WorkDayRepository,
		@Inject(IntegrityRepository) private readonly integrityRepository: IntegrityRepository,
		@Inject(RouteRepository) private readonly routeRepository: RouteRepository,
		private eventEmitter: EventEmitter2,
		private readonly organizeRouteDayCommand: OrganizeRouteDayCommand,
		private readonly mapper: Mapper
	) {}

	async execute(
		id_work_day: string,
		new_operations: Array<{
		id_operation_type: DAY_OPERATIONS_ENUM;
		created_at?: string;
		latitude: string;
		longitude: string;
		id_location?: string;
		id_route_transaction?: string;
		id_inventory_operation?: string;
		id_route_day: string;
		id_day_operation_dependent?: string;
		id_work_day_operation?: string;
		}>,
	): Promise<void> {
		const workDays: WorkDayEntity[] = await this.workDayRepository.retrieveWorkDayByWorkDayId([ id_work_day ])
		if (workDays.length === 0) throw new BusinessRuleException(`Work day with id ${id_work_day} which you are trying to register the route business operations doesn't exist.`);
		
		const { id_route_day } = workDays[0];
		const workDayToAdd:WorkDayAggregate = new WorkDayAggregate(workDays[0]);
		if (!workDayToAdd.isWorkDayFinished()) throw new BusinessRuleException(`Work day with id ${id_work_day} is already finished. You cannot add business operation to a finished work day.`)
			
		// Retrieving work day model
		const currentOperations = await this.workDayRepository.retrieveWorkDayOperationsHistoricByWorkDayId([ id_work_day ]);

		const businessOperationDay = new BusinessOperationDayAggregate(currentOperations);

		// Retrieving existing work day operations
		const workDaysToConsult: (string|undefined)[] = new_operations.map((operation) => operation.id_work_day_operation)
		
		const existingWorkDayOperation: WorkDayOperationHistoricEntity[] = await this.workDayRepository.retrieveWorkDayOperationsHistoricByWorkDayOperationId(
			workDaysToConsult.filter((workdayToConsult) => typeof workdayToConsult === "string")
		);
		
		const existingWorkDayOperationsSet: Set<string> = new Set<string>(existingWorkDayOperation.map((existingWorkDayOp) => existingWorkDayOp.id_work_day_operation))

		// Registering new day operations
		for (const operation of new_operations) {
			const { id_work_day_operation } = operation;

			if (typeof id_work_day_operation === "string") {
				if (existingWorkDayOperationsSet.has(id_work_day_operation)) {
					continue;
				}
			}

			businessOperationDay.createBusinessOperation({
				id_work_day_operation: operation.id_work_day_operation ?? this.integrityRepository.generateUUIDv4(),
				id_work_day,
				id_operation_type: operation.id_operation_type,
				created_at: operation.created_at === undefined ? new Date() : new Date(operation.created_at),
				latitude: operation.latitude,
				longitude: operation.longitude,
				id_location: operation.id_location ? operation.id_location : null,
				id_route_transaction: operation.id_route_transaction ? operation.id_route_transaction : null,
				id_inventory_operation: operation.id_inventory_operation ? operation.id_inventory_operation : null,
				id_route_day: operation.id_route_day,
				id_day_operation_dependent: operation.id_day_operation_dependent ? operation.id_day_operation_dependent : null,
			});
		}

		const newOperations = businessOperationDay.getNewDayOperations();

		if (!newOperations || newOperations.length === 0) {
			return;
		}
		
		// Process for integrating prospect of clients 
		const prospectOfClientOperations = newOperations.filter((operation) => operation.id_operation_type === DAY_OPERATIONS_ENUM.prospect_registration);

		if (prospectOfClientOperations.length > 0) {
			prospectOfClientOperations.forEach((newClientRegistry) => {
				if (newClientRegistry.id_work_day !== id_work_day) throw new BusinessRuleException(`The business operation with id ${newClientRegistry.id_work_day_operation} (type of operation: prospect registration) is invalid. Work days differ. Work day that belongs the prospect of client record: ${newClientRegistry.id_work_day}. Work day of the request: ${id_work_day}`)
			})
			
			const routeDay: RouteDayEntity[] = await this.routeRepository.retrieveRouteDay([ id_route_day ]);
			if (routeDay.length === 0) throw new BusinessRuleException(`Route day with id ${id_route_day} which you are trying to place the new location (through a business operation) doesn't exist.`);
			const { locations } = routeDay[0];

			const routeOrganizationStrategies: OrganizationStrategyEntity[] = await this.routeRepository.listOrganizationStrategies();
			const routeOrganizationStrategyAggregate: RouteOrganizationStrategyAggregate = new RouteOrganizationStrategyAggregate(routeOrganizationStrategies)

			const organizationStrategy:OrganizationStrategyEntity|undefined = routeOrganizationStrategyAggregate.getActiveStrategy();
			if(!organizationStrategy) throw new BusinessRuleException(`Error at moment of organizing the locations with business operation. There is not a selected route organization strategy`);
			const { id_organization_strategy } = organizationStrategy;

			// Organizing prospect of client chronologically 
			prospectOfClientOperations.sort((firstLocation, secondLocation) => firstLocation.created_at.getDate() - secondLocation.created_at.getDate());
			const currentLocationsInRouteSet = new Set<string>(locations.map((loc) => {return loc.id_location}))

			prospectOfClientOperations.forEach((prospectClientOp) => {
				const { id_work_day_operation } = prospectClientOp;
				if (prospectClientOp.id_location === undefined || prospectClientOp.id_location === null) throw new BusinessRuleException(`The business operation register prospect of client (with id: ${id_work_day_operation}) doesn't have id location.`);
				if (currentLocationsInRouteSet.has(prospectClientOp.id_location)) throw new BusinessRuleException(`The location (store) that is trying to add the route has been added previously to the route day.`);
			});

			if (id_organization_strategy === ROUTE_ORGANIZATION_STRATEGIES_ENUM.AFTER_LAST_VISIT_OPERATION) {
				const routeDayLocationSet: Map<string, RouteDayLocationObjectValue> = new Map<string, RouteDayLocationObjectValue>();

				// Creating map of the locations
				/* 
					Potential bug (07-18-26):
					If a location appears twice in a route day, this scenario might 
					cause unexcpected behavior placing a new location in a wrong position.

					This is caused because route day set depends on id_location and not
					in id_route_day_location (id for that particular location).

					To solve this it is needed to change the id and find the last 
					visited store based on the placing and not in the store.


					Due to deadline this design is let as it is.
				*/
				for (const location of locations) {
					const { id_location } = location;
					routeDayLocationSet.set(id_location, location)
				}

				for (const newClientOp of prospectOfClientOperations) { 
					const { id_location, id_work_day_operation  } = newClientOp;
					let positionInRouteOfProspectOfClient: number = -1;
					let isFirstPosition: boolean = false;
					const isFirstOperation = businessOperationDay.isOperationBeforeTheFirstRouteDayClientVisited(id_location);
					
					if (isFirstOperation) {
						console.log("First operation")
						positionInRouteOfProspectOfClient = 1;
						isFirstPosition = true;
					} else {
						const lastOperation:WorkDayOperationHistoricEntity | undefined = businessOperationDay
							.getLastOperationByTypeBeforeCurrentOperation(id_work_day_operation);
						if (lastOperation) { // The prospect of client is in the middle of the route day.
							if (lastOperation.id_location === null) {
								throw new BusinessRuleException(`Last operation with id ${lastOperation.id_work_day_operation} does not have an id_location to locate insertion point.`);
							}
							console.log("In the middle")
							// Find the position of the last visited location
							const lastVisitedLocation:RouteDayLocationObjectValue | undefined = routeDayLocationSet.get(lastOperation.id_location);
							if (lastVisitedLocation === undefined) throw new BusinessRuleException(`Error while locating the new prospect of client within the route. Location with id ${lastOperation.id_location} doesn't not belongs to this day.`);
							
							positionInRouteOfProspectOfClient = lastVisitedLocation.position_in_route;
						} else {
							positionInRouteOfProspectOfClient = routeDayLocationSet.size + 1; // + 1 For transforming from 0-base to 1-base.
						}

					}

					// Updating position of locations
					console.log("Updating positions. ")
					console.log("Position of the new operation to add: ", positionInRouteOfProspectOfClient)
					for (const [idRouteLocation, routeDaylocation] of routeDayLocationSet) {
						const { id_location, id_owner, id_route_day_location, position_in_route} = routeDaylocation;
						console.log("routeDaylocation.position_in_route: ", routeDaylocation.position_in_route)
						if (isFirstPosition) {
						console.log("Is true (first position): ", routeDaylocation.position_in_route >= positionInRouteOfProspectOfClient)
							if (routeDaylocation.position_in_route >= positionInRouteOfProspectOfClient) {
								routeDayLocationSet.set(
									id_location,
									new RouteDayLocationObjectValue(
										position_in_route + 1,
										id_location,
										id_owner, // Route day
										id_route_day_location,
									)
								);
							}
						} else {
							console.log("Is true (first position): ", routeDaylocation.position_in_route >= positionInRouteOfProspectOfClient)
							if (routeDaylocation.position_in_route > positionInRouteOfProspectOfClient) {
								routeDayLocationSet.set(
									id_location,
									new RouteDayLocationObjectValue(
										position_in_route + 1,
										id_location,
										id_owner, // Route day
										id_route_day_location,
									)
								);
							}
						}
					}

					const idNewRouteDayLocation = this.integrityRepository.generateUUIDv4();
					routeDayLocationSet.set(
						idNewRouteDayLocation,
						new RouteDayLocationObjectValue(
								positionInRouteOfProspectOfClient,
								id_location!,
								id_route_day, // Route day
								idNewRouteDayLocation,
						)
					);
				}

				// Persist changes
				console.log("Changes to persist")
				console.log(Array.from(routeDayLocationSet.values()).sort((a, b) => a.position_in_route - b.position_in_route))
				await this.organizeRouteDayCommand.execute(
					id_route_day, 
					Array.from(routeDayLocationSet.values()).sort((a, b) => a.position_in_route - b.position_in_route)
				);

			} else { // Default route organization: Place new clients at the end of the day.
				console.log("At the end")
				let currentPosition = locations.length + 1; // From 0-base index to 1-base index.
				for (const newClientOp of prospectOfClientOperations) { 
					const { id_location  } = newClientOp;
					locations.push(
						new RouteDayLocationObjectValue(
							currentPosition,
							id_location!,
							id_route_day,
							this.integrityRepository.generateUUIDv4()
						)
					);
					currentPosition += 1;
				}	
				await this.organizeRouteDayCommand.execute(id_route_day, locations);
			}
		}
		
		await this.workDayRepository.insertWorkDayHistoric(newOperations);

		newOperations.forEach((newOperation) => {
			const { id_operation_type, id_location } = newOperation;
			if (id_operation_type === DAY_OPERATIONS_ENUM.new_client_confirmation) {
				if (!id_location) throw new BusinessRuleException(`Cannot emit confirmed client event for operation ${newOperation.id_work_day_operation} because id_location is missing.`);
				this.eventEmitter.emit(
					DOMAIN_EVENT_ENUM.CONFIRMED_CLIENT_EVENT,
					new ConfirmedClientEvent(id_location)
				);
			}
		})

		this.eventEmitter.emit(
			DOMAIN_EVENT_ENUM.BUSINESS_OPERATION_EVENT,
			newOperations.map((newOperation) => {return this.mapper.toDto(newOperation)})
		)
	}
}
