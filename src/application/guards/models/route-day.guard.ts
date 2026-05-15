import type { RouteDayModel } from '@/src/application/models/route-day.model';

import { isRecord } from '@/src/shared/guards/utils';

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
