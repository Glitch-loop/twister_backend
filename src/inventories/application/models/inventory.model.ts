export interface InventoryModel {
  id_inventory: string;
  inventory_context: number;
  inventory_name: string;
  is_active: number;
  stock_validation: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  assigned_to: string|null;
  assigned_facility: string|null;
}