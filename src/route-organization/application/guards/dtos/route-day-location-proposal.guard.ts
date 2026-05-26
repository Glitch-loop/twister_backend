import type { RouteDayLocationProposalDto } from '@/src/route-organization/application/dtos/route-day-location-proposal.dto';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isRouteDayLocationProposalDto = (value: unknown): value is RouteDayLocationProposalDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_route_day_location_proposal === 'string' &&
    typeof value.position_in_route === 'number' &&
    typeof value.id_location === 'string'
  );
};
