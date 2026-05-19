import type { RouteDayLocationObjectValue } from '@/src/route-organization/core/value-objects/route-day-location.object-value';
import { isRecord } from '@/src/shared/application/guards/utils';

export const isRouteDayLocationObjectValue = (value: unknown): value is RouteDayLocationObjectValue => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.position_in_route === 'number' &&
    typeof value.id_location === 'string' &&
    typeof value.id_owner === 'string'
  );
};