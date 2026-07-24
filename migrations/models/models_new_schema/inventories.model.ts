export class InventoriesModel {
  constructor(
    public readonly id_inventory: string,
    public readonly inventory_context: number,
    public readonly is_active: number,
    public readonly inventory_name: string,
    public readonly stock_validation: number,
    public readonly assigned_to: string | null,
    public readonly assigned_facility: string | null,
    public readonly created_by: string,
    public readonly updated_at: string,
    public readonly created_at: string,
  ) {}
}
