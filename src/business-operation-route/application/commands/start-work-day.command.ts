// Libraries
import { Inject, Injectable } from '@nestjs/common';

// Entities
import { WorkDayEntity } from '@/src/business-operation-route/core/entities/work-day.entity';

// Aggregates
import { WorkDayAggregate } from '@/src/business-operation-route/core/aggregates/work-day.aggregate';

// Repositories
import { WorkDayRepository } from '@/src/business-operation-route/core/interfaces/work-day.repository';

// Errors
import { BusinessRuleException } from '@/src/shared/errors/BusinessRuleException';

// Shared module
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

// Route organization module
import { RouteEntity } from '@/src/route-organization/core/entities/route.entity';
import { RouteAggregate } from '@/src/route-organization/core/aggregates/route.aggregate';
import { RouteRepository } from '@/src/route-organization/core/interfaces/route.repository'
import { RouteDayEntity } from '@/src/route-organization/core/entities/route-day.entity';

@Injectable()
export class StartWorkDayCommand {
	constructor(
		@Inject(WorkDayRepository) private readonly workDayRepository: WorkDayRepository,
		@Inject(RouteRepository) private readonly routesRepository: RouteRepository,
		@Inject(IntegrityRepository) private readonly integrityRepository: IntegrityRepository,
	) {}

	async execute(
		start_date: Date,
		start_petty_cash: number,
		id_route_day: string,
		id_user: string,
		id_work_day?: string,
	): Promise<void> {
		const workDayAggregate:WorkDayAggregate = new WorkDayAggregate(null);

		const workDayId = id_work_day ?? this.integrityRepository.generateUUIDv4();

		const routeDays: RouteDayEntity[] = await this.routesRepository.retrieveRouteDay([id_route_day]);
		
		if (routeDays.length === 0) throw new BusinessRuleException(`The route day with id ${id_route_day} you are trying to create a work day does not exist`);
		
		const { id_route } = routeDays[0];
		const routes: RouteEntity[] = await this.routesRepository.retrieveRoutesByRouteId([id_route]);

		const routeAggregate = new RouteAggregate(routes[0]);
		
		if (!routeAggregate.validateRouteIsActive()) throw new BusinessRuleException(`You cannot create a new work day because the route with id ${id_route} is innactive.`);
		
		const userOpenWorkDays:WorkDayEntity[] = await this.workDayRepository.listWorkDays(1, undefined, null, undefined, undefined, [id_user], undefined, undefined, undefined)
		
		if (userOpenWorkDays.length > 0) throw new BusinessRuleException(`User with id ${id_user} already have an opened workday. Close the current work day to create a new one for the user.`);

		workDayAggregate.startWorkDay( 
			workDayId,
			start_petty_cash,
			id_route,
			id_user,
			id_route_day,
			start_date
		)

		const newWorkDay: WorkDayEntity = workDayAggregate.getWorkDayInformation();

		await this.workDayRepository.insertWorkDay(newWorkDay);
	}
}
