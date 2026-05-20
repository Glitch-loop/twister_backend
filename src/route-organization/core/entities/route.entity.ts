import { ROUTE_STATUS_ENUM } from "@/src/route-organization/core/enums/route-status.enum";

export class RouteEntity {
  constructor(
    public readonly id_route: string,
    public readonly route_name: string,
    public readonly route_status: ROUTE_STATUS_ENUM,
    public readonly description?: string,
  ) {}
}
