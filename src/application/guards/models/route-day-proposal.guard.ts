import type { RouteDayProposalModel } from '../../models/route-day-proposal.model';

import { isRecord } from '../utils';

export const isRouteDayProposalModel = (value: unknown): value is RouteDayProposalModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_route_day_proposal === 'string' &&
    typeof value.proposal_name === 'string' &&
    value.created_at instanceof Date &&
    typeof value.id_route_day === 'string'
  );
};
