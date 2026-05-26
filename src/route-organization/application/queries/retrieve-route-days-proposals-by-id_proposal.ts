import { Inject, Injectable } from '@nestjs/common';

import { RouteProposalRepository } from '@/src/route-organization/core/interfaces/route-proposals.repository';
import { RouteDayProposalDto, RouteDayLocationProposalDto } from '@/src/route-organization/application/dtos/route-day-proposal.dto';
import { RouteDayProposalEntity } from '@/src/route-organization/core/entities/route-day-proposal.entity';
import { RouteDayLocationObjectValue } from '@/src/route-organization/core/value-objects/route-day-location.object-value';

@Injectable()
export class RetrieveRouteDaysProposalsByIdProposalQuery {
	constructor(
		@Inject(RouteProposalRepository) private readonly routeProposalRepository: RouteProposalRepository,
	) {}

	async execute(id_route_day_proposals: string[]): Promise<RouteDayProposalDto[]> {
		if (id_route_day_proposals.length > 100) {
			throw new Error('Retrieve by id limit is 100.');
		}

		const proposals: RouteDayProposalEntity[] = await this.routeProposalRepository.retrieveRouteDayProposalById(
			id_route_day_proposals,
		);

		const proposalIds = proposals.map((proposal) => proposal.id_route_day_proposal);
		const routeDayLocationProposals: RouteDayLocationObjectValue[] =
			await this.routeProposalRepository.retrieveRouteDayLocationProposalsByRouteDayProposalId(proposalIds);

		const routeDayLocationProposalsByProposalId = new Map<string, RouteDayLocationObjectValue[]>();

		for (const location of routeDayLocationProposals) {
			const locations = routeDayLocationProposalsByProposalId.get(location.id_owner) ?? [];
			locations.push(location);
			routeDayLocationProposalsByProposalId.set(location.id_owner, locations);
		}

		return proposals.map((proposal) => {
			const locations = routeDayLocationProposalsByProposalId.get(proposal.id_route_day_proposal) ?? [];

			const locationDtos = locations
				.sort((a, b) => a.position_in_route - b.position_in_route)
				.map((location) => new RouteDayLocationProposalDto(
					location.id_route_day_location_proposal!,
					location.position_in_route,
					location.id_location,
				));

			return new RouteDayProposalDto(
				proposal.id_route_day_proposal,
				proposal.proposal_name,
				proposal.created_at,
				proposal.id_route_day,
				locationDtos,
			);
		});
	}
}
