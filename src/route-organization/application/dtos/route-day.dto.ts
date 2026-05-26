import { RouteDayLocationDto } from "@/src/route-organization/application/dtos/route-day-location.dto";

export class RouteDayDto {
  constructor(
    public readonly id_route_day: string,
    public readonly id_route: string,
    public readonly id_day: string,
    public readonly locations: RouteDayLocationDto[],
  ) {}
}
