import { Inject, Injectable } from '@nestjs/common';

// Repository
import { RouteRepository } from '@/src/route-organization/core/interfaces/route.repository';

// Aggregate
import { RouteAggregate } from '@/src/route-organization/core/aggregates/route.aggregate';
import RouteDayAggregate from '@/src/route-organization/core/aggregates/route-day.aggregate';

// Entity
import { RouteEntity } from '@/src/route-organization/core/entities/route.entity';
import { RouteDayEntity } from '@/src/route-organization/core/entities/route-day.entity';
import { AssignedRouteDayEntity } from '@/src/route-organization/core/entities/assigned-route-day.entity';

@Injectable()
export class DeactivateRouteCommand {
  constructor(
    @Inject(RouteRepository) private readonly routeRepository: RouteRepository,
  ) {}

  async execute(id_route: string): Promise<void> {
    const routeEntities: RouteEntity[] = await this.routeRepository.retrieveRoutesByRouteId([id_route]);
    const assignationsByRouteDay: Map<string, AssignedRouteDayEntity[]> = new Map(); // <route_day_id, AssignedRouteDayEntity>
    const assignationsToDelete: AssignedRouteDayEntity[] = [];

    if (routeEntities.length === 0) {
      throw new Error(`Route with id ${id_route} does not exist.`);
    }
    
    const routeAggregate = new RouteAggregate(routeEntities[0]);
    
    /*
      Business rule:
      A deactivated route cannot have assigned any user (vendor).

      If a route day belongs to a route that is considered as "deactive", then this route day will 
      also be considered as deactive.

    */
    const routeDayEntities: RouteDayEntity[] = await this.routeRepository.retrieveRouteDayByRouteId([id_route]);
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

      for (const assignation of assignations) {
        /*
          All assignations for this particular route day must be removed from the route day.
        */
        assignationsToDelete.push(
          routeDayAggregate.unassignAssignationFromRouteDay(assignation.id_assigned_route_day)
        );
      }
    }
    
    const deactivatedRoute = routeAggregate.deactivateRoute();
    
    // Persist changes
    await this.routeRepository.removeRouteDayAssignation(assignationsToDelete);

    await this.routeRepository.updateRoute(id_route, {
      route_status: deactivatedRoute.route_status,
    });
  }
}
