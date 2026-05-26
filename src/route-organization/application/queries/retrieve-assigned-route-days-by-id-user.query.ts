// Librarires
import { Inject } from "@nestjs/common";

import { RouteRepository } from "@/src/route-organization/core/interfaces/route.repository";
import { RouteDayEntity } from "@/src/route-organization/core/entities/route-day.entity";
import { Mapper } from "@/src/route-organization/application/mappers/entity-dto.mapper";
import { RouteDayDto } from "@/src/route-organization/application/dtos/route-day.dto";


export class RetrieveAssignedRouteDaysByIdUserQuery {
  constructor(
    @Inject(RouteRepository) private readonly routeRepository: RouteRepository,
    private readonly mapper: Mapper
  ) {}

  async execute(id_user: string[]): Promise<RouteDayDto[]> {
    if (id_user.length > 10) {
      throw new Error('A maximum of 10 user ids is allowed.');
    }

    const routeDaysByUser: RouteDayEntity[] = await this.routeRepository.retrieveRouteDayByUserId(id_user);
    return routeDaysByUser.map((routeDay: RouteDayEntity) => this.mapper.toDto(routeDay));
  }
} 