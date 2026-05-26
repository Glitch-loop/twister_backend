import { Inject, Injectable } from '@nestjs/common';

import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';
import { RouteProposalRepository } from '@/src/route-organization/core/interfaces/route-proposals.repository';
import { RouteRepository } from '@/src/route-organization/core/interfaces/route.repository';
import { RouteDayProposalEntity } from '@/src/route-organization/core/entities/route-day-proposal.entity';
import { RouteDayLocationObjectValue } from '@/src/route-organization/core/value-objects/route-day-location.object-value';

@Injectable()
export class CreateRouteDayProposalCommand {
  constructor(
    @Inject(RouteRepository) private readonly routeRepository: RouteRepository,
    @Inject(RouteProposalRepository) private readonly routeProposalRepository: RouteProposalRepository,
    @Inject(IntegrityRepository) private readonly integrityRepository: IntegrityRepository,
  ) {}

  async execute(
    proposal_name: string,
    id_route_day: string,
    locations: Array<{ position_in_route: number; id_location: string }>,
  ): Promise<void> {
    const routeDayEntities = await this.routeRepository.retrieveRouteDay([id_route_day]);

    if (routeDayEntities.length === 0) {
      throw new Error(`Route day with id ${id_route_day} does not exist.`);
    }

    const id_route_day_proposal = this.integrityRepository.generateUUIDv4();
    const routeDayProposal = new RouteDayProposalEntity(
      id_route_day_proposal,
      proposal_name,
      new Date(),
      id_route_day,
    );

    const routeDayLocationProposals = this.normalizeLocations(id_route_day_proposal, locations);

    await this.routeProposalRepository.createRouteDayProposal(routeDayProposal, routeDayLocationProposals);
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
