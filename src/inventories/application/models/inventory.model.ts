import { INVENTORY_CONTEXT_ENUM } from '@/src/inventories/core/enums/inventory-context.enum';
import { INVENTORY_STATE_ENUM } from '@/src/inventories/core/enums/inventory-state-enum';
import { STOCK_VALIDATION_ENUM } from '@/src/inventories/core/enums/stock-validation.enum';

export interface InventoryModel {
  id_inventory: string;
  inventory_context: INVENTORY_CONTEXT_ENUM;
  inventory_name: string;
  is_active: INVENTORY_STATE_ENUM;
  stock_validation: STOCK_VALIDATION_ENUM;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  assigned_facility: string|null;
  assigned_to: string|null;
}