import type { RouteDayModel } from '../../models/route-day.model';

import { isRecord } from '../utils';

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
