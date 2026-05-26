import type { RouteDto } from '@/src/route-organization/application/dtos/route.dto';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isRouteDto = (value: unknown): value is RouteDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_route === 'string' &&
    typeof value.route_name === 'string' &&
    (value.description === undefined || typeof value.description === 'string')
  );
};
