export interface InventoryOperationDescriptionModel {
  id_product_operation_description: string;
  price_at_moment: number;
  cost_at_moment: number;
  quantity: number;
  created_at: Date;
  id_inventory_operation: string;
  id_product: string;
}