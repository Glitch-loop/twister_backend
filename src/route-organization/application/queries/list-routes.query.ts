import { Inject, Injectable } from '@nestjs/common';

import { RouteDto } from '@/src/route-organization/application/dtos/route.dto';
import { Mapper } from '@/src/route-organization/application/mappers/entity-dto.mapper';
import { RouteEntity } from '@/src/route-organization/core/entities/route.entity';
import { RouteRepository } from '@/src/route-organization/core/interfaces/route.repository';

@Injectable()
export class ListRoutesQuery {
	constructor(
		@Inject(RouteRepository) private readonly routeRepository: RouteRepository,
		private readonly mapper: Mapper,
	) {}

	async execute(route_name?: string, route_status?: number): Promise<RouteDto[]> {
		const routes: RouteEntity[] = await this.routeRepository.listRoutes(route_name, route_status);
		return routes.map((route) => this.mapper.toDto(route));
	}
}
