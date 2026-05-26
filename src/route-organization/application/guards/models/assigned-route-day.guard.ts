import type { AssignedRouteDayModel } from '@/src/route-organization/application/models/assigned-route-day.model';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isAssignedRouteDayModel = (value: unknown): value is AssignedRouteDayModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_assigned_route_day === 'string' &&
    typeof value.id_route_day === 'string' &&
    typeof value.id_user === 'string'
  );
};
