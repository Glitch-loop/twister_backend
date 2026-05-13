export class InventoryOperationDescription {
  constructor(
    public readonly amount: number,
    public readonly price_at_moment: number,
    public readonly id_inventory_operation: string,
    public readonly id_product: string,
    public readonly created_at: Date,
    public readonly id_inventory_operation_description: string,
  ) {}
}
