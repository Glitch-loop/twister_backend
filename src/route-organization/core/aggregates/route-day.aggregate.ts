
import { RouteDayEntity } from '@/src/route-organization/core/entities/route-day.entity';
import { RouteDayLocationObjectValue } from '@/src/route-organization/core/value-objects/route-day-location.object-value';
import { AssignedRouteDayEntity } from '../entities/assigned-route-day.entity';

export default class RouteDayAggregate {
  private _routeDay: RouteDayEntity | null = null;
  private _assignedVendors: AssignedRouteDayEntity[] = [];
  private _routeDayLocations: RouteDayLocationObjectValue[] = [];


    constructor(
      private readonly _routeDayParam: RouteDayEntity | null, 
      private readonly _assignations: AssignedRouteDayEntity[]) {
        if(_routeDayParam !== null && _assignations.length > 0) {
            throw new Error(
                `Invalid route day assignations. Route day has not been initialized.`,
            );
        }

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


            // Verify all the assignations belongs to this route day
            for (const assignation of _assignations) {
              

              if (assignation.id_route_day === id_route_day) {
                this._assignedVendors.push(
                  new AssignedRouteDayEntity(
                    assignation.id_assigned_route_day,
                    assignation.created_at,
                    id_route_day,
                    assignation.id_user,
                    assignation.expired_at,
                  )
                );
              } else {
                throw new Error(
                  `Invalid route day assignation: ${assignation.id_assigned_route_day}. This assingation is not assigend to the route day: ${id_route_day}.`,
                )
              }
            }
        }
    }

    public createRouteDay(idRouteDay: string, idRoute: string, idDay: string): RouteDayEntity {
      this._routeDayLocations = [];
      this._routeDay = new RouteDayEntity(idRouteDay, idRoute, idDay, this._routeDayLocations);
      return this._routeDay;
    }

    public removeStoreFromRouteDay(idRouteDayStore: string): void {
      if (this._routeDay === null) throw new Error('Route day not initialized');
      
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

    public organizeRouteDayStores(locations: RouteDayLocationObjectValue[]): RouteDayEntity {
      if (this._routeDay === null) throw new Error('Route day not initialized');

      const { id_route_day } = this._routeDay;
      const orderedLocations = [...locations].sort((a, b) => a.position_in_route - b.position_in_route);

      this._routeDayLocations = orderedLocations.map((location, index) => {
        if (location.id_owner !== id_route_day) {
          throw new Error(
            `Invalid location owner id ${location.id_owner}. Expected route day id ${id_route_day}.`,
          );
        }

        if (!location.id_route_day_location) {
          throw new Error('Cannot organize route day with locations missing id_route_day_location.');
        }

        return new RouteDayLocationObjectValue(
          index + 1,
          location.id_location,
          id_route_day,
          location.id_route_day_location,
          location.id_route_day_location_proposal,
        );
      });

      this.syncRouteDayLocations();
      return this.getRouteDay();
    }

    public assignRouteDayToUser(id_assignation: string, id_user: string, expired_at: Date | undefined): AssignedRouteDayEntity {
      if (this._routeDay === null) throw new Error('Route day not initialized');

      /*
        Business rule
        A user can be assigned to a route day only once.
      */

      const alreadyAssigned = this._assignedVendors.some(
        (assignation) => assignation.id_user === id_user,
      );

      if (alreadyAssigned) {
        throw new Error(`User with id ${id_user} is already assigned to route day with id ${this._routeDay.id_route_day}.`);
      }

      
      const newAssignation:AssignedRouteDayEntity = new AssignedRouteDayEntity(
        id_assignation,
        new Date(),
        this._routeDay.id_route_day,
        id_user,
        expired_at,
      );

      this._assignedVendors.push(
        newAssignation
      );

      return newAssignation;

    }

    public unassignAssignationFromRouteDay(id_assigned_route_day) {
      if (this._routeDay === null) throw new Error('Route day not initialized');
      const assignationIndex: number = this._assignedVendors.findIndex(
        (assignation) => assignation.id_user === id_assigned_route_day,
      );

      if (assignationIndex === -1) {
        throw new Error(`Route day assignation with id ${id_assigned_route_day} is not assigned to route day with id ${this._routeDay.id_route_day}.`);
      }

      const [removedAssignation] = this._assignedVendors.splice(assignationIndex, 1);
      return removedAssignation;      
    }

    public unassignRouteDayFromUser(id_user: string): AssignedRouteDayEntity {
      if (this._routeDay === null) throw new Error('Route day not initialized');
      const assignationIndex: number = this._assignedVendors.findIndex(
        (assignation) => assignation.id_user === id_user,
      );

      if (assignationIndex === -1) {
        throw new Error(`User with id ${id_user} is not assigned to route day with id ${this._routeDay.id_route_day}.`);
      }

      const [removedAssignation] = this._assignedVendors.splice(assignationIndex, 1);
      return removedAssignation;
    }

    private syncRouteDayLocations(): void {
      if (this._routeDay === null) return;
      const { id_route_day, id_route, id_day } = this._routeDay;
      this._routeDay = new RouteDayEntity(id_route_day, id_route, id_day, [...this._routeDayLocations]);
    }
}

