import { INVENTORY_CONTEXT_ENUM } from '@/src/inventory/core/enums/inventory-context.enum';
import { INVENTORY_STATE_ENUM } from '@/src/inventory/core/enums/inventory-state-enum';

export interface InventoryModel {
  id_inventory: string;
  inventory_context: INVENTORY_CONTEXT_ENUM;
  inventory_name: string;
  is_active: INVENTORY_STATE_ENUM;
  updated_at: Date;
  created_at: Date;
  created_by: string;
  assigned_facility?: string;
  assigned_factory?: string;
}