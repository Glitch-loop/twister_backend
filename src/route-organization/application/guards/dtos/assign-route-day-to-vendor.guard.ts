import type { AssignRouteDayToVendorDto } from '@/src/route-organization/application/dtos/assign-route-day-to-vendor.dto';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isAssignRouteDayToVendorDto = (value: unknown): value is AssignRouteDayToVendorDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    (value.id_assigned_route_day === undefined || typeof value.id_assigned_route_day === 'string') &&
    typeof value.id_route_day === 'string' &&
    typeof value.id_user === 'string' &&
    (value.expired_at === undefined || value.expired_at instanceof Date)
  );
};
