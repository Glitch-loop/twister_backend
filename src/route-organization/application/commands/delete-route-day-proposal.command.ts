import { Inject, Injectable } from '@nestjs/common';

import { RouteProposalRepository } from '@/src/route-organization/core/interfaces/route-proposals.repository';

@Injectable()
export class DeleteRouteDayProposalCommand {
  constructor(
    @Inject(RouteProposalRepository) private readonly routeProposalRepository: RouteProposalRepository,
  ) {}

  async execute(id_route_day_proposal: string): Promise<void> {
    const routeDayProposals = await this.routeProposalRepository.retrieveRouteDayProposalById([id_route_day_proposal]);

    if (routeDayProposals.length === 0) {
      throw new Error(`Route day proposal with id ${id_route_day_proposal} does not exist.`);
    }

    await this.routeProposalRepository.deleteRouteDayProposal(id_route_day_proposal);
  }
}
