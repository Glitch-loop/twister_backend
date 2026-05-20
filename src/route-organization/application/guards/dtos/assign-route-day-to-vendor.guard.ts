import type { assigned_route_day } from '@/src/route-organization/application/dtos/assign-route-day-to-vendor.dto';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isAssignedRouteDayDto = (value: unknown): value is assigned_route_day => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    (value.id_assigned_route_day === undefined || typeof value.id_assigned_route_day === 'string') &&
    typeof value.id_route_day === 'string' &&
    typeof value.id_user === 'string'
  );
};
