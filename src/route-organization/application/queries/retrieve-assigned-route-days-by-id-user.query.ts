// Librarires
import { Inject, Injectable } from "@nestjs/common";

import { RouteRepository } from "@/src/route-organization/core/interfaces/route.repository";
import { RouteDayEntity } from "@/src/route-organization/core/entities/route-day.entity";
import { AssignedRouteDayEntity } from "@/src/route-organization/core/entities/assigned-route-day.entity";
import { Mapper } from "@/src/route-organization/application/mappers/entity-dto.mapper";
import { RouteDayDto } from "@/src/route-organization/application/dtos/route-day.dto";
import { RouteDayAssignation } from "@/src/route-organization/core/aggregates/route-day-assignation";

@Injectable()
export class RetrieveAssignedRouteDaysByIdUserQuery {
  constructor(
    @Inject(RouteRepository) private readonly routeRepository: RouteRepository,
    private readonly mapper: Mapper
  ) {}

  async execute(id_user: string[]): Promise<RouteDayDto[]> {
		const maxIds = 10;
		const idUserToRetrieve = id_user.slice(0, maxIds);

    const routeDaysByUser: RouteDayEntity[] = await this.routeRepository.retrieveRouteDayByUserId(idUserToRetrieve);

    if (routeDaysByUser.length === 0) {
      return [];
    }

    const routeDayIds = routeDaysByUser.map((routeDay) => routeDay.id_route_day);
    const assignations: AssignedRouteDayEntity[] = await this.routeRepository.retrieveRouteDayAssignaments(routeDayIds);
    console.log(assignations)
    const expiredAssignations: AssignedRouteDayEntity[] = assignations.filter((assignation) => {
      if (!idUserToRetrieve.includes(assignation.id_user)) {
        return false;
      }

      const assignationAggregate = new RouteDayAssignation(assignation);
      return assignationAggregate.isAssignationExpired();
    });

    if (expiredAssignations.length > 0) {
      // await this.routeRepository.removeRouteDayAssignation(expiredAssignations);
    }

    const activeRouteDayIds = new Set(
      assignations
        .filter(
          (assignation) =>
            idUserToRetrieve.includes(assignation.id_user)
            && !expiredAssignations.some((expired) => expired.id_assigned_route_day === assignation.id_assigned_route_day),
        )
        .map((assignation) => assignation.id_route_day),
    );

    const filteredRouteDays = routeDaysByUser.filter((routeDay) => activeRouteDayIds.has(routeDay.id_route_day));

    return filteredRouteDays.map((routeDay: RouteDayEntity) => this.mapper.toDto(routeDay));
  }
} 