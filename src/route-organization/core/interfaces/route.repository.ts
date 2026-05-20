// Object values
import { RouteDayLocationObjectValue } from '@/src/route-organization/core/value-objects/route-day-location.object-value';

// Entities
import { RouteEntity } from '@/src/route-organization/core/entities/route.entity';
import { RouteDayEntity } from '@/src/route-organization/core/entities/route-day.entity';
import { AssignedRouteDayEntity } from '@/src/route-organization/core/entities/assigned-route-day.entity';
import { DayEntity } from '@/src/route-organization/core/entities/day.entity';

export abstract class RouteRepository {
  abstract deleteRouteDayLocations(idRouteDay: string): Promise<void>;
  abstract insertRouteDayLocations(routeDayLocations: RouteDayLocationObjectValue[]): Promise<void>;
  abstract createRoute(routeEntity: RouteEntity, routeDays: RouteDayEntity[]): Promise<void>;
  abstract updateRoute(idRoute: string, updatedData: Partial<RouteEntity>): Promise<void>;
  abstract createRouteDayAssignation(assignedRouteDay: AssignedRouteDayEntity): Promise<void>;
  abstract removeRouteDayAssignation(assignedRouteDay: AssignedRouteDayEntity[]): Promise<void>;
  abstract createRouteDay(routeDayEntity: RouteDayEntity): Promise<void>;
  abstract listDays(): Promise<DayEntity[]>;
  abstract retrieveRoutesByRouteId(idRoutes: string[]): Promise<RouteEntity[]>;
  abstract retrieveRouteDayByRouteId(idRoutes: string[]): Promise<RouteDayEntity[]>;
  abstract retrieveRouteDayByUserId(idUsers: string[]): Promise<RouteDayEntity[]>;
  abstract retrieveRouteDay(idRetrieveRouteDays: string[]): Promise<RouteDayEntity[]>;
  abstract retrieveRouteDayAssignaments(idRouteDays: string[]): Promise<AssignedRouteDayEntity[]>
}
