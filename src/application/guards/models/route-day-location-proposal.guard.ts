import type { RouteDayLocationProposalModel } from '../../models/route-day-location-proposal.model';

import { isRecord } from '../utils';

export const isRouteDayLocationProposalModel = (value: unknown): value is RouteDayLocationProposalModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_route_day_location_proposal === 'string' &&
    typeof value.position_in_route === 'number' &&
    typeof value.id_route_day_proposal === 'string' &&
    typeof value.id_location === 'string'
  );
};
