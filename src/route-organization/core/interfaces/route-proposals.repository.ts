// Object values
import { RouteDayLocationObjectValue } from '@/src/route-organization/core/value-objects/route-day-location.object-value';

// Entities
import { RouteDayProposalEntity } from '@/src/route-organization/core/entities/route-day-proposal.entity';

export abstract class RouteProposalRepository {
  abstract createRouteDayProposal(
    routeDayProposal: RouteDayProposalEntity,
    routeDayLocationProposals: RouteDayLocationObjectValue[],
  ): Promise<void>;
  abstract updateRouteDayProposal(
    idRouteDayProposal: string,
    updatedData: Partial<RouteDayProposalEntity>,
    routeDayLocationProposals?: RouteDayLocationObjectValue[],
  ): Promise<void>;
  abstract deleteRouteDayProposal(idRouteDayProposal: string): Promise<void>;
  abstract listRouteDayProposals(
    limit: number,
    lastCreatedAt?: string,
    lastIdRouteDayProposal?: string,
    proposalName?: string,
    idRouteDay?: string,
  ): Promise<RouteDayProposalEntity[]>;
  abstract retrieveRouteDayProposalById(idRouteDayProposals: string[]): Promise<RouteDayProposalEntity[]>;
  abstract retrieveRouteDayLocationProposalsByRouteDayProposalId(
    idRouteDayProposals: string[],
  ): Promise<RouteDayLocationObjectValue[]>;
}
