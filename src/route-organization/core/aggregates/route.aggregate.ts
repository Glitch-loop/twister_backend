import { RouteEntity } from "@/src/route-organization/core/entities/route.entity";
import { ROUTE_STATUS_ENUM } from "@/src/route-organization/core/enums/route-status.enum";

export class RouteAggregate {
  routeEntity: RouteEntity | null;
  constructor(routeEntity: RouteEntity | null) {
    this.routeEntity = routeEntity;
  }

  createRoute(id_route: string, route_name: string, description: string | null) {
    const newRouteEntity = new RouteEntity(
      id_route,
      route_name, 
      ROUTE_STATUS_ENUM.ACTIVE, // When creating a new route, the status is active.
      description,
    );

    this.routeEntity = newRouteEntity;

    return newRouteEntity;
  }


  updateRoute(route_name?: string, description?: string): RouteEntity {
    if (this.routeEntity) {
      if (this.routeEntity.route_status === ROUTE_STATUS_ENUM.INACTIVE) {
        throw new Error("Cannot update an inactive route. Please activate the route before updating.");
      }

      this.routeEntity = new RouteEntity(
        this.routeEntity.id_route,
        route_name ?? this.routeEntity.route_name, 
        ROUTE_STATUS_ENUM.ACTIVE,
        description ?? this.routeEntity.description,
      );

      return this.routeEntity;
    } else {
      throw new Error("Route entity does not exist. Cannot update.");
    }
  }

  deactivateRoute(): RouteEntity {
    if (this.routeEntity) {
      this.routeEntity = new RouteEntity(
        this.routeEntity.id_route,
        this.routeEntity.route_name, 
        ROUTE_STATUS_ENUM.INACTIVE,
        this.routeEntity.description,
      );

      return this.routeEntity;
    } else {
      throw new Error("Route entity does not exist. Cannot deactivate.");
    }
  }

  reactivateRoute(): RouteEntity {
    if (this.routeEntity) {
      if (this.routeEntity.route_status === ROUTE_STATUS_ENUM.ACTIVE) {
        throw new Error("Route is already active. No need to reactivate.");
      }

      this.routeEntity = new RouteEntity(
        this.routeEntity.id_route,
        this.routeEntity.route_name, 
        ROUTE_STATUS_ENUM.ACTIVE,
        this.routeEntity.description,
      );

      return this.routeEntity;
    } else {
      throw new Error("Route entity does not exist. Cannot deactivate.");
    }
  }

  validateRouteIsActive(): boolean {
    if (!this.routeEntity) {
      throw new Error('Route entity does not exist.');
    }

    if (this.routeEntity.route_status === ROUTE_STATUS_ENUM.ACTIVE) {
      return true;
    } else {
      return false;
    }
  }
}