import type { RouteDayLocationDto } from '@/src/route-organization/application/dtos/route-day-location.dto';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isRouteDayLocationDto = (value: unknown): value is RouteDayLocationDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.position_in_route === 'number' &&
    typeof value.id_location === 'string' &&
    typeof value.id_user === 'string' &&
    typeof value.id_route_day_location === 'string'
  );
};
