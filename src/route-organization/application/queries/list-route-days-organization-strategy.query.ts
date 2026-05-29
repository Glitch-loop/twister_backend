import { Inject, Injectable } from '@nestjs/common';

import { RouteRepository } from '@/src/route-organization/core/interfaces/route.repository';
import { OrganizationStrategyEntity } from '@/src/route-organization/core/entities/organization-strategy.entity';
import { OrganizationStrategyDto } from '@/src/route-organization/application/dtos/route-day-organization-strategy.dto';
import { Mapper } from '@/src/route-organization/application/mappers/entity-dto.mapper';

@Injectable()
export class ListRouteDaysOrganizationStrategyQuery {
	constructor(
		@Inject(RouteRepository) private readonly routeRepository: RouteRepository,
		private readonly mapper: Mapper,
	) {}

	async execute(): Promise<OrganizationStrategyDto[]> {
		const organizationStrategies: OrganizationStrategyEntity[] = await this.routeRepository.listOrganizationStrategies();

		return organizationStrategies.map((strategy) => this.mapper.toDto(strategy));
	}
}
