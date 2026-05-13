export class OrganizationStrategy {
  constructor(
    public readonly id_organization_strategy: string,
    public readonly organization_strategy_name: string,
    public readonly is_used: number,
    public readonly created_at: Date,
  ) {}
}
