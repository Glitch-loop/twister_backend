import { Inject, Injectable } from '@nestjs/common';

import { RouteRepository } from '@/src/route-organization/core/interfaces/route.repository';
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

import { RouteAggregate } from '@/src/route-organization/core/aggregates/route.aggregate';
import RouteDayAggregate from '@/src/route-organization/core/aggregates/route-day.aggregate';

import { AssignedRouteDayEntity } from '@/src/route-organization/core/entities/assigned-route-day.entity';
import { RouteEntity } from '@/src/route-organization/core/entities/route.entity';
import { RouteDayEntity } from '@/src/route-organization/core/entities/route-day.entity';
import { BusinessRuleException } from '../../errors/BusinessRuleException';

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
    const routeDayEntities: RouteDayEntity[] = await this.routeRepository.retrieveRouteDay([id_route_day]);

    if (routeDayEntities.length === 0) {
      throw new Error(`Route day with id ${id_route_day} does not exist.`);
    }

    const routeDayAggregate = new RouteDayAggregate(routeDayEntities[0], []);
    
    const routeDay = routeDayAggregate.getRouteDay();
    
    const routeEntities: RouteEntity[] = await this.routeRepository.retrieveRoutesByRouteId([routeDay.id_route]);

    if (routeEntities.length === 0) {
      throw new Error(`Route with id ${routeDay.id_route} does not exist.`);
    }

    const routeDayAssignedToUser:AssignedRouteDayEntity[] = await this.routeRepository.retrieveRouteDayAssignaments([id_route_day]); 

    const isAlreadyAssigned:boolean = routeDayAssignedToUser
      .some((routeAssignation) => { return routeAssignation.id_route_day === id_route_day && routeAssignation.id_user === id_user });

    if (isAlreadyAssigned) {
      throw new BusinessRuleException(`Route day with id ${routeDay.id_route_day} is already assigned to user ${id_user}.`);
    }

    const routeAggregate = new RouteAggregate(routeEntities[0]);
    routeAggregate.validateRouteIsActive();

    const assignationToCreate: AssignedRouteDayEntity = routeDayAggregate.assignRouteDayToUser(
      this.integrityRepository.generateUUIDv4(),
      id_user,
      expired_at,
    )

    await this.routeRepository.createRouteDayAssignation(assignationToCreate);
  }
}
