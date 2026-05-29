import type { RouteDayProposalEntity } from '@/src/route-organization/core/entities/route-day-proposal.entity';
import { isRecord } from '@/src/shared/application/guards/utils';

export const isRouteDayProposalEntity = (value: unknown): value is RouteDayProposalEntity => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id_route_day_proposal === 'string' &&
    typeof value.proposal_name === 'string' &&
    typeof value.id_route_day === 'string'
  );
};
