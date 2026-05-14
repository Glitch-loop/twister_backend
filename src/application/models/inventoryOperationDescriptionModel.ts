export interface InventoryOperationDescriptionModel {
  id_inventory_operation_description: string;
  amount: number;
  price_at_moment: number;
  id_inventory_operation: string;
  id_product: string;
  created_at: Date;
}
