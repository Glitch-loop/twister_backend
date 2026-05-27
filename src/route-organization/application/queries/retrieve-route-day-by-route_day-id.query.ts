import { Inject, Injectable } from '@nestjs/common';

import { RouteDayDto } from '@/src/route-organization/application/dtos/route-day.dto';
import { Mapper } from '@/src/route-organization/application/mappers/entity-dto.mapper';
import { RouteDayEntity } from '@/src/route-organization/core/entities/route-day.entity';
import { RouteRepository } from '@/src/route-organization/core/interfaces/route.repository';

@Injectable()
export class RetrieveRouteDayByRouteDayIdQuery {
	constructor(
		@Inject(RouteRepository) private readonly routeRepository: RouteRepository,
		private readonly mapper: Mapper,
	) {}

	async execute(id_route_days: string[]): Promise<RouteDayDto[]> {
		const maxIds = 100;
		const idClientToRetreive = id_route_days.slice(0, maxIds);
		const routeDays: RouteDayEntity[] = await this.routeRepository.retrieveRouteDay(idClientToRetreive);
		return routeDays.map((routeDay) => this.mapper.toDto(routeDay));
	}
}
