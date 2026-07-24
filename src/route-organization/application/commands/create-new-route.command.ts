// Libraries
import { Inject, Injectable } from '@nestjs/common';

// Interfaces
import { RouteRepository } from '@/src/route-organization/core/interfaces/route.repository';

// Entities
import { RouteEntity } from '@/src/route-organization/core/entities/route.entity';
import { RouteDayEntity } from '@/src/route-organization/core/entities/route-day.entity';
import { DayEntity } from '@/src/route-organization/core/entities/day.entity';

// Aggregates
import RouteDayAggregate from '@/src/route-organization/core/aggregates/route-day.aggregate';

// Repository
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';
import { RouteAggregate } from '@/src/route-organization/core/aggregates/route.aggregate';


@Injectable()
export class CreateNewRouteCommand {
  constructor(
    @Inject(RouteRepository) private readonly routeRepository: RouteRepository,
    @Inject(IntegrityRepository) private readonly integrityRepository: IntegrityRepository,
  ) {}

  async execute(route_name: string, description?: string): Promise<void> {
    const routeDays: RouteDayEntity[] = [];
    
    const routeAggregate = new RouteAggregate(null);
    const routeDayAggregate = new RouteDayAggregate(null, []);

    const routeEntity: RouteEntity = routeAggregate.createRoute(
      this.integrityRepository.generateUUIDv4(),
      route_name,
      description === undefined ? null : description,
    );

    /*
      Once created the route, we need to create the days that compound the route.
      At the moment (05-20-26), it's created by default 6 days (Monday to Saturday),
      this is because there is not a business case that requires a different configuration.
    */

    const days:DayEntity[] = await this.routeRepository.listDays();
    const { id_route } = routeEntity;

    for (const day of days) {
      const { id_day } = day;
      routeDays.push(
        routeDayAggregate.createRouteDay(
          this.integrityRepository.generateUUIDv4(),
          id_route,
          id_day
        )
      )
    }

    await this.routeRepository.createRoute(routeEntity, routeDays);
  }
}