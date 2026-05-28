import { Inject, Injectable } from '@nestjs/common';

import { RouteRepository } from '@/src/route-organization/core/interfaces/route.repository';
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

import { RouteAggregate } from '@/src/route-organization/core/aggregates/route.aggregate';
import RouteDayAggregate from '@/src/route-organization/core/aggregates/route-day.aggregate';

import { AssignedRouteDayEntity } from '@/src/route-organization/core/entities/assigned-route-day.entity';
import { RouteEntity } from '@/src/route-organization/core/entities/route.entity';
import { RouteDayEntity } from '@/src/route-organization/core/entities/route-day.entity';
import { BusinessRuleException } from '@/src/shared/errors/BusinessRuleException';

@Injectable()
export class AssignRouteToVendorCommand {
  constructor(
    @Inject(RouteRepository) private readonly routeRepository: RouteRepository,
    @Inject(IntegrityRepository) private readonly integrityRepository: IntegrityRepository,
  ) {}

  async execute(
    id_user: string,
    id_route_day: string,
    expired_at?: Date,
  ): Promise<void> {
    // Retrieving necessary information
    const routeDayEntities: RouteDayEntity[] = await this.routeRepository.retrieveRouteDay([id_route_day]);
    if (routeDayEntities.length === 0) throw new BusinessRuleException(`Route day with id ${id_route_day} does not exist.`);
    const routeDayToAssign: RouteDayEntity = routeDayEntities[0];

    const routeEntities: RouteEntity[] = await this.routeRepository.retrieveRoutesByRouteId([routeDayToAssign.id_route]);
    if (routeEntities.length === 0) throw new BusinessRuleException(`Route with id ${routeDayToAssign.id_route} does not exist.`);
    const routeThatBelongs: RouteEntity = routeEntities[0];

    // Validate if the route might have assignations
    const routeAggregate = new RouteAggregate(routeThatBelongs);
    if (!routeAggregate.validateRouteIsActive()) throw new BusinessRuleException(`You cannot make this assignation because the route is deactivated.`);

    const routeDayAssignedToUser:AssignedRouteDayEntity[] = await this.routeRepository.retrieveRouteDayAssignaments([id_route_day]); 

    // Route day validation
    const routeDayAggregate = new RouteDayAggregate(routeDayToAssign, routeDayAssignedToUser);
    
    // Assign user
    const assignationToCreate: AssignedRouteDayEntity = routeDayAggregate.assignRouteDayToUser(
      this.integrityRepository.generateUUIDv4(),
      id_user,
      expired_at,
    )

    // Persist changes
    await this.routeRepository.createRouteDayAssignation(assignationToCreate);
  }
}
