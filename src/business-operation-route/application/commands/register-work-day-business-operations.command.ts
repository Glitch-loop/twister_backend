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
		created_at?: Date;
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
		if(!workDayToAdd.isWorkDayFinished()) throw new BusinessRuleException(`Work day with id ${id_work_day} is already finished. You cannot add business operation to a finished work day.`)
			
		// Retrieving work day model
		const currentOperations = await this.workDayRepository.retrieveWorkDayOperationsHistoricByWorkDayId([
			id_work_day,
		]);

		const businessOperationDay = new BusinessOperationDayAggregate(
			currentOperations.length > 0 ? currentOperations : null,
		);

		for (const operation of new_operations) {
			businessOperationDay.createBusinessOperation({
				id_work_day_operation: operation.id_work_day_operation ?? this.integrityRepository.generateUUIDv4(),
				id_work_day,
				id_operation_type: operation.id_operation_type,
				created_at: operation.created_at ?? new Date(),
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
		
		// Process for integrating a new client 
		const newClientLocationOperation = newOperations.filter((operation) => operation.id_operation_type === DAY_OPERATIONS_ENUM.prospect_registration);
		if (newClientLocationOperation.length > 0) {
			newClientLocationOperation.forEach((newClientRegistry) => {
				if (newClientRegistry.id_work_day !== id_work_day) throw new BusinessRuleException(`The business operation with id ${newClientRegistry.id_work_day_operation} (type of operation: register new client) is invalid. Work days differ. Work day that belongs the new client record: ${newClientRegistry.id_work_day}. Work day of the request ${id_work_day}`)
			})
			
			const routeDay: RouteDayEntity[] = await this.routeRepository.retrieveRouteDay([ id_route_day ]);
			if (routeDay.length === 0) throw new BusinessRuleException(`Route day with id ${id_route_day} which you are trying to place a new location (through a business operation) doesn't exist.`);
			
			const routeOrganizationStrategies: OrganizationStrategyEntity[] = await this.routeRepository.listOrganizationStrategies();
			const routeOrganizationStrategyAggregate: RouteOrganizationStrategyAggregate = new RouteOrganizationStrategyAggregate(routeOrganizationStrategies)

			const organizationStrategy:OrganizationStrategyEntity|undefined = routeOrganizationStrategyAggregate.getActiveStrategy();

			if(!organizationStrategy) throw new BusinessRuleException(`Error at moment of organizing the locations with business operation. There is not a selected route organization strategy`);

			const { id_organization_strategy } = organizationStrategy;

			newClientLocationOperation.sort((firstLocation, secondLocation) => firstLocation.created_at.getDate() - secondLocation.created_at.getDate());
			
			const { locations } = routeDay[0];

			const currentLocationsInRouteSet = new Set<string>(locations.map((loc) => {return loc.id_location}))

			newClientLocationOperation.forEach((newclientOp) => {
				const { id_work_day_operation } = newclientOp;
				if (newclientOp.id_location === undefined || newclientOp.id_location === null) throw new BusinessRuleException(`The new 'client business operation' with the id: ${id_work_day_operation} doesn't have it's id location.`);
				if (currentLocationsInRouteSet.has(newclientOp.id_location)) throw new BusinessRuleException(`The location (store) that is trying to add to the route has been added previously to the route day.`);
			});

			if (id_organization_strategy === ROUTE_ORGANIZATION_STRATEGIES_ENUM.AFTER_LAST_VISIT_OPERATION) {
				const operationDays = new Set<DAY_OPERATIONS_ENUM>([DAY_OPERATIONS_ENUM.client_visited, DAY_OPERATIONS_ENUM.new_client_confirmation, DAY_OPERATIONS_ENUM.prospect_registration]);

				for (const newClientOp of newClientLocationOperation) { 
					const { id_location, id_work_day_operation  } = newClientOp;
					const lastOperation:WorkDayOperationHistoricEntity | undefined = businessOperationDay.getLastOperationByTypeBeforeCurrentOperation(id_work_day_operation, operationDays)
					
					if (lastOperation) {
						if (!lastOperation.id_location) {
							throw new BusinessRuleException(
								`Last operation with id ${lastOperation.id_work_day_operation} does not have an id_location to locate insertion point.`,
							);
						}

						const lastLocationIndex = locations.findIndex((loc) => loc.id_location === lastOperation.id_location);
						if (lastLocationIndex === -1) {
							throw new BusinessRuleException(
								`Location with id ${lastOperation.id_location} was not found in route day ${id_route_day}.`,
							);
						}

						const insertIndex = lastLocationIndex + 1;
						locations.splice(
							insertIndex,
							0,
							new RouteDayLocationObjectValue(
								insertIndex + 1,
								id_location!,
								id_route_day,
								this.integrityRepository.generateUUIDv4(),
							),
						);

						for (let position = 0; position < locations.length; position += 1) {
							const location = locations[position];
							locations[position] = new RouteDayLocationObjectValue(
								position + 1,
								location.id_location,
								location.id_owner,
								location.id_route_day_location,
							);
						}
					} else {
						const currentPosition = locations.length + 1;
						locations.push(
							new RouteDayLocationObjectValue(
								currentPosition,
								id_location!,
								id_route_day,
								this.integrityRepository.generateUUIDv4(),
							),
						);
					}
				}
			} else { // Default route organization: Place new clients at the end of the day.
				let currentPosition = locations.length + 1; // From 0-base index to 1-base index.
				for (const newClientOp of newClientLocationOperation) { 
					const { id_location  } = newClientOp;
					locations.push(
						new RouteDayLocationObjectValue(
							currentPosition,
							id_location!,
							id_route_day,
							this.integrityRepository.generateUUIDv4()
						)
					)
					currentPosition += 1;
				}	
			}

			await this.organizeRouteDayCommand.execute(id_route_day, locations);
		}
		
		await this.workDayRepository.insertWorkDayHistoric(newOperations);


		newOperations.forEach((newOperation) => {
			const { id_operation_type, id_location } = newOperation;
			console.log("NEW CLIENT EVENT EMIT: ", id_operation_type === DAY_OPERATIONS_ENUM.new_client_confirmation)
			if (id_operation_type === DAY_OPERATIONS_ENUM.new_client_confirmation) {
				if (!id_location) {
					throw new BusinessRuleException(
						`Cannot emit confirmed client event for operation ${newOperation.id_work_day_operation} because id_location is missing.`,
					);
				}
				console.log("Event emitted")
				this.eventEmitter.emit(
					DOMAIN_EVENT_ENUM.CONFIRMED_CLIENT_EVENT,
					new ConfirmedClientEvent(id_location)
				)
			}
		})

		this.eventEmitter.emit(
			DOMAIN_EVENT_ENUM.BUSINESS_OPERATION_EVENT,
			newOperations.map((newOperation) => {return this.mapper.toDto(newOperation)})
		)
	}
}
