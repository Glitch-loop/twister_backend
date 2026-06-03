export interface InventoryBalanceModel {
  id_inventory_balance: string;
  quantity: number;
  created_at: Date;
  id_location_inventory: string;
  id_product: string;
}