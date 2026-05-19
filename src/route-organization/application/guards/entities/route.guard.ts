import type { RouteEntity } from '@/src/route-organization/core/entities/route.entity';
import { isRecord } from '@/src/shared/application/guards/utils';

export const isRouteEntity = (value: unknown): value is RouteEntity => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id_route === 'string' &&
    typeof value.route_name === 'string' &&
    typeof value.route_status === 'number' &&
    (value.description === undefined || typeof value.description === 'string')
  );
};
