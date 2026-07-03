// Entities
import type { InventoryEntity } from '@/src/inventories/core/entities/inventory.entity';

// Enums
import { INVENTORY_CONTEXT_ENUM } from '@/src/inventories/core/enums/inventory-context.enum';
import { INVENTORY_STATE_ENUM } from '@/src/inventories/core/enums/inventory-state-enum';
import { STOCK_VALIDATION_ENUM } from '@/src/inventories/core/enums/stock-validation.enum';

// Utils
import { isRecord } from '@/src/shared/application/guards/utils';

export const isInventoryEntity = (value: unknown): value is InventoryEntity => {
  if (!isRecord(value)) {
    return false;
  }
  
  return (
    typeof value.id_inventory === 'string' &&
    typeof value.inventory_context === 'number' && Object.values(INVENTORY_CONTEXT_ENUM).includes(value.inventory_context) &&
    typeof value.inventory_name === 'string' &&
    typeof value.is_active === 'number' && Object.values(INVENTORY_STATE_ENUM).includes(value.is_active) &&
    typeof value.stock_validation === 'number' && Object.values(STOCK_VALIDATION_ENUM).includes(value.stock_validation) &&
    value.created_at instanceof Date &&
    value.updated_at instanceof Date &&
    typeof value.created_by === 'string' &&
    (value.assigned_facility === null || typeof value.assigned_facility === 'string') &&
    (value.assigned_to === null || typeof value.assigned_to === 'string')
  );
};