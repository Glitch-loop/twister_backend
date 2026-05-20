import { Inject, Injectable } from '@nestjs/common';

import { RouteRepository } from '@/src/route-organization/core/interfaces/route.repository';
import { RouteAggregate } from '@/src/route-organization/core/aggregates/route.aggregate';
import { RouteEntity } from '@/src/route-organization/core/entities/route.entity';

@Injectable()
export class ReactivateRouteCommand {
  constructor(
    @Inject(RouteRepository) private readonly routeRepository: RouteRepository,
  ) {}

  async execute(id_route: string): Promise<void> {
    const routeEntities: RouteEntity[] = await this.routeRepository.retrieveRoutesByRouteId([id_route]);

    if (routeEntities.length === 0) {
      throw new Error(`Route with id ${id_route} does not exist.`);
    }

    const routeAggregate = new RouteAggregate(routeEntities[0]);
    const reactivatedRoute = routeAggregate.reactivateRoute();

    await this.routeRepository.updateRoute(id_route, {
      route_status: reactivatedRoute.route_status,
    });
  }
}
