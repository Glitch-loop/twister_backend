
import { Inject, Injectable } from '@nestjs/common';

import { RouteRepository } from '@/src/route-organization/core/interfaces/route.repository';
import { RouteAggregate } from '@/src/route-organization/core/aggregates/route.aggregate';
import RouteDayAggregate from '@/src/route-organization/core/aggregates/route-day.aggregate';

import { RouteEntity } from '@/src/route-organization/core/entities/route.entity';
import { RouteDayEntity } from '@/src/route-organization/core/entities/route-day.entity';
import { RouteDayLocationObjectValue } from '@/src/route-organization/core/value-objects/route-day-location.object-value';

@Injectable()
export class OrganizeRouteDayCommand {
    constructor(
        @Inject(RouteRepository) private readonly routeRepository: RouteRepository,
    ) {}

    async execute(id_route_day: string, routeDayLocations: RouteDayLocationObjectValue[]): Promise<void> {
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

        const routeAggregate = new RouteAggregate(routeEntities[0]);
        routeAggregate.validateRouteIsActive();

        const updatedRouteDay = routeDayAggregate.organizeRouteDayStores(routeDayLocations);

        await this.routeRepository.deleteRouteDayLocations(updatedRouteDay.id_route_day);
        await this.routeRepository.insertRouteDayLocations(updatedRouteDay.locations);
    }
}