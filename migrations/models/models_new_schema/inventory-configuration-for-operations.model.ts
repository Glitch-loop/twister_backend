export class InventoryConfigurationForOperationsModel {
  constructor(
    public readonly id_inventory_configuration: string,
    public readonly origin_inventory: string,
    public readonly target_inventory: string,
    public readonly created_by: string,
    public readonly user_assigned_to: string | null,
    public readonly facility_assigned_to: string | null,
    public readonly inventory_operation_type: string,
    public readonly created_at: string,
  ) {}
}
