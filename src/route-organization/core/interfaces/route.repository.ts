import { RouteDayLocationObjectValue } from '@/src/route-organization/core/value-objects/route-day-location.object-value';
import { RouteEntity } from '@/src/route-organization/core/entities/route.entity';
import { RouteDayEntity } from '@/src/route-organization/core/entities/route-day.entity';
import { AssignedRouteDayEntity } from '../entities/assigned-route-day.entity';

export abstract class RouteRepository {
  abstract deleteRouteDayLocations(idRouteDay: string): Promise<void>;
  abstract insertRouteDayLocations(routeDayLocations: RouteDayLocationObjectValue[]): Promise<void>;
  abstract createRoute(routeEntity: RouteEntity, routeDays: RouteDayEntity[]): Promise<void>;
  abstract updateRoute(routeEntity: RouteEntity): Promise<void>;
  abstract assignRouteDayToVendor(assienedRouteDay: AssignedRouteDayEntity): Promise<void>;
  abstract unassignRouteDayToVendor(idVendor: string, idRouteDay: string[]): Promise<void>;
}
