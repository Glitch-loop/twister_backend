import { OrganizationStrategyEntity } from "@/src/route-organization/core/entities/organization-strategy.entity";


export class RouteOrganizationStrategyAggregate {
  private readonly organizationStrategies: OrganizationStrategyEntity[] | null;
  
  constructor(_organizationStrategies: OrganizationStrategyEntity[]) {
    this.organizationStrategies = _organizationStrategies;
  }

  getActiveStrategy():OrganizationStrategyEntity|undefined {
    if (this.organizationStrategies === null || this.organizationStrategies.length === 0) {
      return undefined;
    }

    return this.organizationStrategies.find((strategy) => strategy.is_used === 1);
  }
}