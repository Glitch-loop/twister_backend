import { ROUTE_ORGANIZATION_STRATEGIES_ENUM } from "@/src/route-organization/core/enums/route-organization-strategies.enum";

export class OrganizationStrategyEntity {
  constructor(
    public readonly id_organization_strategy: ROUTE_ORGANIZATION_STRATEGIES_ENUM,
    public readonly organization_strategy_name: string,
    public readonly is_used: number,
    public readonly created_at: Date,
  ) {}
}
