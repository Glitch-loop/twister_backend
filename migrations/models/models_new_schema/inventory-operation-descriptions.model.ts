export class InventoryOperationDescriptionsModel {
  constructor(
    public readonly id_inventory_operation_description: string,
    public readonly id_inventory_operation: string,
    public readonly id_product: string,
    public readonly quantity: number,
    public readonly price_at_moment: number,
    public readonly cost_at_moment: number,
    public readonly created_at: string,
  ) {}
}
