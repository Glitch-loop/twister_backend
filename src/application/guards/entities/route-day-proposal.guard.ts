import type { RouteDayProposalEntity } from '@/src/core/entities/route-day-proposal.entity';
import { isRecord } from '@/src/application/guards/utils';

export const isRouteDayProposalEntity = (value: unknown): value is RouteDayProposalEntity => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id_route_day_proposal === 'string' &&
    typeof value.proposal_name === 'string' &&
    value.created_at instanceof Date &&
    typeof value.id_route_day === 'string'
  );
};
