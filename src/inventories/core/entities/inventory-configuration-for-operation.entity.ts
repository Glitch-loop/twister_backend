export class InventoryConfigurationForOperationEntity {
  constructor(
    public readonly id_inventory_configuration: string,
    public readonly inventory_operation: string,
    public readonly origin_inventory: string,
    public readonly target_inventory: string,
    public readonly created_at: Date,
    public readonly user_assigned_to: string,
    public readonly facility_assigned_to: string
  ) {}
}
