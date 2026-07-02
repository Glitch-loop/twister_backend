// Models
import type { InventoryBalanceModel } from '@/src/inventories/application/models/inventory-balance.model';

// Utils
import { isRecord } from '@/src/shared/application/guards/utils';

export const isInventoryBalanceModel = (value: unknown): value is InventoryBalanceModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_inventory_balance === 'string' &&
    typeof value.quantity === 'number' &&
    (value.min_quantity === null || typeof value.min_quantity === 'number') &&
    (value.max_quantity === null || typeof value.max_quantity === 'number') &&
    typeof value.created_at === 'string' &&
    typeof value.updated_at === 'string' &&
    typeof value.id_inventory === 'string' &&
    typeof value.id_product === 'string'
  );
};