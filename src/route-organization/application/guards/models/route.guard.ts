import type { RouteModel } from '@/src/route-organization/application/models/route.model';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isRouteModel = (value: unknown): value is RouteModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_route === 'string' &&
    typeof value.route_name === 'string' &&
    typeof value.route_status === 'number' &&
    (value.description === undefined || typeof value.description === 'string')
  );
};
