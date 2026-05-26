import { Inject, Injectable } from '@nestjs/common';

import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';
import { RouteProposalRepository } from '@/src/route-organization/core/interfaces/route-proposals.repository';
import { RouteDayLocationObjectValue } from '@/src/route-organization/core/value-objects/route-day-location.object-value';

@Injectable()
export class UpdateRouteDayProposalCommand {
  constructor(
    @Inject(RouteProposalRepository) private readonly routeProposalRepository: RouteProposalRepository,
    @Inject(IntegrityRepository) private readonly integrityRepository: IntegrityRepository,
  ) {}

  async execute(
    id_route_day_proposal: string,
    proposal_name?: string,
    locations?: Array<{ position_in_route: number; id_location: string }>,
  ): Promise<void> {
    const routeDayProposals = await this.routeProposalRepository.retrieveRouteDayProposalById([id_route_day_proposal]);

    if (routeDayProposals.length === 0) {
      throw new Error(`Route day proposal with id ${id_route_day_proposal} does not exist.`);
    }

    const normalizedLocations = locations
      ? this.normalizeLocations(id_route_day_proposal, locations)
      : undefined;

    await this.routeProposalRepository.updateRouteDayProposal(
      id_route_day_proposal,
      { proposal_name },
      normalizedLocations,
    );
  }

  private normalizeLocations(
    id_route_day_proposal: string,
    locations: Array<{ position_in_route: number; id_location: string }>,
  ): RouteDayLocationObjectValue[] {
    return [...locations]
      .sort((a, b) => a.position_in_route - b.position_in_route)
      .map((location, index) => new RouteDayLocationObjectValue(
        index + 1,
        location.id_location,
        id_route_day_proposal,
        undefined,
        this.integrityRepository.generateUUIDv4(),
      ));
  }
}
