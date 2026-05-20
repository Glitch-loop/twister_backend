import { RouteDayLocationObjectValue } from "@/src/route-organization/core/value-objects/route-day-location.object-value";

export class RouteDayEntity {
  constructor(
    public readonly id_route_day: string,
    public readonly id_route: string,
    public readonly id_day: string,
    public readonly locations: RouteDayLocationObjectValue[],
  ) {}
}
