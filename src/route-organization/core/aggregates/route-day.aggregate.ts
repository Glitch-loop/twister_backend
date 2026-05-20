
import { RouteDayEntity } from '@/src/route-organization/core/entities/route-day.entity';
import { RouteDayLocationObjectValue } from '@/src/route-organization/core/value-objects/route-day-location.object-value';

export default class RouteDayAggregate {
  private _routeDay: RouteDayEntity | null = null;
  private _routeDayLocations: RouteDayLocationObjectValue[] = [];

    constructor(private readonly _routeDayParam: RouteDayEntity | null) {
        if (_routeDayParam) {
            const { locations, id_route_day, id_route, id_day } = _routeDayParam;

            for (const location of locations) {
                const { id_location, id_owner } = location;
                if (id_owner !== id_route_day) {
                    throw new Error(
                        `Invalid location with id ${id_location} for route day with id ${id_route_day}. The location's owner id ${id_owner} does not match the route day id ${id_route_day}.`,
                    );
                }

                this._routeDayLocations.push(
                    new RouteDayLocationObjectValue(
                        location.position_in_route,
                        location.id_location,
                        location.id_owner,
                        location.id_route_day_location,
                        location.id_route_day_location_proposal,
                    ),
                );
            }

            this._routeDay = new RouteDayEntity(id_route_day, id_route, id_day, [...this._routeDayLocations]);
        }
    }

    public createRouteDay(idRouteDay: string, idRoute: string, idDay: string): void {
      this._routeDayLocations = [];
      this._routeDay = new RouteDayEntity(idRouteDay, idRoute, idDay, this._routeDayLocations);
    }

    public removeStoreFromRouteDay(idRouteDayStore: string): void {
      const orderedLocations = [...this._routeDayLocations].sort((a, b) => a.position_in_route - b.position_in_route);
      const filteredLocations = orderedLocations.filter(
        (location) => location.id_route_day_location !== idRouteDayStore,
      );

      this._routeDayLocations = filteredLocations.map((location, index) => {
        const { id_location, id_owner, id_route_day_location, id_route_day_location_proposal } = location;

        return new RouteDayLocationObjectValue(
          index + 1,
          id_location,
          id_owner,
          id_route_day_location,
          id_route_day_location_proposal,
        );
        });

      this.syncRouteDayLocations();
    }

    public addStoreToRouteDay(idRouteDayStore: string, idStore: string): void { // Always adds the store to the end of the route day stores list.
      if (this._routeDay === null) throw new Error('Route day not initialized');

      const { id_route_day } = this._routeDay;
      const positionInRoute = this._routeDayLocations.length + 1;

      this._routeDayLocations.push(
        new RouteDayLocationObjectValue(positionInRoute, idStore, id_route_day, idRouteDayStore),
      );

      this.syncRouteDayLocations();
    }
    
    public clearRouteDayStores(): void {
      if (this._routeDay === null) throw new Error('Route day not initialized');
      this._routeDayLocations = [];
      this.syncRouteDayLocations();
    }

    public getRouteDay(): RouteDayEntity {
      if (this._routeDay === null) throw new Error('Route day not initialized');
      const { id_route_day, id_route, id_day } = this._routeDay;
      return new RouteDayEntity(id_route_day, id_route, id_day, [...this._routeDayLocations]);
    }

    public getRouteDayStores(): RouteDayLocationObjectValue[] {
      return [...this._routeDayLocations];
    }

    private syncRouteDayLocations(): void {
      if (this._routeDay === null) return;
      const { id_route_day, id_route, id_day } = this._routeDay;
      this._routeDay = new RouteDayEntity(id_route_day, id_route, id_day, [...this._routeDayLocations]);
    }



}

