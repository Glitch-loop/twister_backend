import { Inject, Injectable } from '@nestjs/common';

import { RouteProposalRepository } from '@/src/route-organization/core/interfaces/route-proposals.repository';
import { RouteDayProposalDto } from '@/src/route-organization/application/dtos/route-day-proposal.dto';
import { RouteDayLocationProposalDto } from '@/src/route-organization/application/dtos/route-day-location-proposal.dto';
import { RouteDayProposalEntity } from '@/src/route-organization/core/entities/route-day-proposal.entity';
import { RouteDayLocationObjectValue } from '@/src/route-organization/core/value-objects/route-day-location.object-value';

@Injectable()
export class ListRouteDaysProposalsQuery {
	constructor(
		@Inject(RouteProposalRepository) private readonly routeProposalRepository: RouteProposalRepository,
	) {}

	async execute(
		limit?: number,
		proposal_name?: string,
		id_route_day?: string,
		lastCreatedAt?: string,
		lastIdRouteDayProposal?: string,
	): Promise<RouteDayProposalDto[]> {
		let limitToUse = 101;

		if ((lastCreatedAt && !lastIdRouteDayProposal) || (!lastCreatedAt && lastIdRouteDayProposal)) {
			throw new Error('If consulting a page larger than 1, pagination metadata is required.');
		}

		if (limit !== undefined) {
			if (limit <= 0 || limit > 100) {
				throw new Error('Limit must be greater than 0 and less than or equal to 100.');
			}

			limitToUse = limit + 1;
		}

		const proposals: RouteDayProposalEntity[] = await this.routeProposalRepository.listRouteDayProposals(
			limitToUse,
			lastCreatedAt,
			lastIdRouteDayProposal,
			proposal_name,
			id_route_day,
		);

		const proposalIds = proposals.map((proposal) => proposal.id_route_day_proposal);
		const routeDayLocationProposals = await this.routeProposalRepository.retrieveRouteDayLocationProposalsByRouteDayProposalId(
			proposalIds,
		);

		return this.mapProposalDtos(proposals, routeDayLocationProposals);
	}

	private mapProposalDtos(
		proposals: RouteDayProposalEntity[],
		routeDayLocationProposals: RouteDayLocationObjectValue[],
	): RouteDayProposalDto[] {
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
					location.id_route_day_location,
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
