import type { RouteModel } from '../../models/route.model';

import { isRecord } from '../utils';

export const isRouteModel = (value: unknown): value is RouteModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_route === 'string' &&
    typeof value.route_name === 'string' &&
    (value.description === undefined || typeof value.description === 'string') &&
    typeof value.route_status === 'number'
  );
};
