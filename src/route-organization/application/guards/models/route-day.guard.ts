import type { RouteDayModel } from '@/src/route-organization/application/models/route-day.model';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isRouteDayModel = (value: unknown): value is RouteDayModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_route_day === 'string' &&
    typeof value.id_route === 'string' &&
    typeof value.id_day === 'string'
  );
};
