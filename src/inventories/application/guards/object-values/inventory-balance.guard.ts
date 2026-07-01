// Object value
import type { InventoryBalanceObjectValue } from '@/src/inventories/core/value-objects/inventory-balance.object-value';

// Utils
import { isRecord } from '@/src/shared/application/guards/utils';

export const isInventoryBalanceObjectValue = (value: unknown): value is InventoryBalanceObjectValue => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_inventory_balance === 'string' &&
    typeof value.quantity === 'number' &&
    (value.min_quantity === null || typeof value.min_quantity === 'number') &&
    (value.max_quantity === null || typeof value.max_quantity === 'number') &&
    value.created_at instanceof Date &&
    typeof value.id_inventory === 'string' &&
    typeof value.id_product === 'string'
  );
};