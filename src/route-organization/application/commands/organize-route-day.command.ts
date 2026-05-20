
import { Inject, Injectable } from '@nestjs/common';

import { RouteRepository } from '@/src/route-organization/core/interfaces/route.repository';
import { RouteDayLocationObjectValue } from '@/src/route-organization/core/value-objects/route-day-location.object-value';

@Injectable()
export class OrganizeRouteDayCommand {
    constructor(
        @Inject(RouteRepository) private readonly routeRepository: RouteRepository,
    ) {}

    async execute(id_route_day: string, routeDayLocations: RouteDayLocationObjectValue[]): Promise<void> {
        // TODO: Verify route day only contains active stores.
        // TODO: Verify the order of the stores is ascendent and there is not missing positions.

        const sortedLocations = [...routeDayLocations].sort(
            (a, b) => a.position_in_route - b.position_in_route,
        );

        const routeDayLocationsToUpdate = sortedLocations.map((location, index) => {
            if (location.id_owner !== id_route_day) {
                throw new Error(
                    `Invalid location owner id ${location.id_owner}. Expected route day id ${id_route_day}.`,
                );
            }

            return new RouteDayLocationObjectValue(
                index + 1,
                location.id_location,
                id_route_day,
                location.id_route_day_location,
                location.id_route_day_location_proposal,
            );
        });

        await this.routeRepository.deleteRouteDayLocations(id_route_day);
        await this.routeRepository.insertRouteDayLocations(routeDayLocationsToUpdate);
    }
}