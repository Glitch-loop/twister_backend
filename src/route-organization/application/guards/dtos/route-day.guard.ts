import type { RouteDayDto } from '@/src/route-organization/application/dtos/route-day.dto';

import { isRecord } from '@/src/shared/application/guards/utils';
import { isRouteDayLocationDto } from '@/src/route-organization/application/guards/dtos/route-day-location.guard';

export const isRouteDayDto = (value: unknown): value is RouteDayDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_route_day === 'string' &&
    typeof value.id_route === 'string' &&
    typeof value.id_day === 'string' &&
    Array.isArray(value.locations) &&
    value.locations.every((location) => isRouteDayLocationDto(location))
  );
};
