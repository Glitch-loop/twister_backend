export interface InventoryBalanceModel {
  id_inventory_balance: string;
  quantity: number;
  min_quantity: number|null;
  max_quantity: number|null;
  created_at: string;
  updated_at: string;
  id_inventory: string;
  id_product: string;
}