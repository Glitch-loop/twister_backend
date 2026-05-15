import type { RouteDayLocationModel } from '@/src/application/models/route-day-location.model';

import { isRecord } from '@/src/shared/guards/utils';

export const isRouteDayLocationModel = (value: unknown): value is RouteDayLocationModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_route_day_location === 'string' &&
    typeof value.position_in_route === 'number' &&
    typeof value.id_location === 'string' &&
    typeof value.id_route_day === 'string'
  );
};
