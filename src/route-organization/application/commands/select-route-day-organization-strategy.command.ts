import { Inject, Injectable } from '@nestjs/common';

import { RouteRepository } from '@/src/route-organization/core/interfaces/route.repository';

@Injectable()
export class SelectRouteDayOrganizationStrategyCommand {
	constructor(
		@Inject(RouteRepository) private readonly routeRepository: RouteRepository,
	) {}

	async execute(id_organization_strategy: string): Promise<void> {
		await this.routeRepository.selectOrganizationStrategy(id_organization_strategy);
	}
}
