import { Inject, Injectable } from '@nestjs/common';

import { RouteRepository } from '@/src/route-organization/core/interfaces/route.repository';
import RouteDayAggregate from '@/src/route-organization/core/aggregates/route-day.aggregate';

import { RouteDayEntity } from '@/src/route-organization/core/entities/route-day.entity';
import { AssignedRouteDayEntity } from '../../core/entities/assigned-route-day.entity';

@Injectable()
export class UnassignRouteToVendorCommand {
  constructor(
    @Inject(RouteRepository) private readonly routeRepository: RouteRepository,
  ) {}

  async execute(
    id_user: string, 
    id_route_days: string[]
  ): Promise<void> {
    const assignationToRemove: AssignedRouteDayEntity[] = [];
    const assignationsByRouteDay: Map<string, AssignedRouteDayEntity[]> = new Map(); // <route_day_id, AssignedRouteDayEntity>

    if (id_route_days.length === 0) {
      return;
    }

    const routeDayEntities: RouteDayEntity[] = await this.routeRepository.retrieveRouteDay(id_route_days);

    if (routeDayEntities.length !== id_route_days.length) {
      throw new Error('One or more route day ids do not exist.');
    }


    const routeDaysId: string[] = routeDayEntities.map((routeDay) => routeDay.id_route_day);
    
    const routeDayAssignations: AssignedRouteDayEntity[] = await this.routeRepository.retrieveRouteDayAssignaments(routeDaysId);

    for (const assignation of routeDayAssignations) {
      const assignations = assignationsByRouteDay.get(assignation.id_route_day) ?? [];
      assignations.push(assignation);
      assignationsByRouteDay.set(assignation.id_route_day, assignations);
    }

    for (const routeDayEntity of routeDayEntities) {
      const { id_route_day } = routeDayEntity;
      const assignations: AssignedRouteDayEntity[] = assignationsByRouteDay.get(id_route_day) ?? [];
      const routeDayAggregate = new RouteDayAggregate(routeDayEntity, assignations);
      assignationToRemove.push(
        routeDayAggregate.unassignRouteDayFromUser(id_user)
      );
    }

    await this.routeRepository.removeRouteDayAssignation(assignationToRemove);
  }
}
