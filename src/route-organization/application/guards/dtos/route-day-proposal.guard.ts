import type { RouteDayProposalDto } from '@/src/route-organization/application/dtos/route-day-proposal.dto';

import { isRecord } from '@/src/shared/application/guards/utils';
import { isRouteDayLocationProposalDto } from '@/src/route-organization/application/guards/dtos/route-day-location-proposal.guard';

export const isRouteDayProposalDto = (value: unknown): value is RouteDayProposalDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_route_day_proposal === 'string' &&
    typeof value.proposal_name === 'string' &&
    typeof value.id_route_day === 'string' &&
    Array.isArray(value.locations) &&
    value.locations.every((location) => isRouteDayLocationProposalDto(location))
  );
};
