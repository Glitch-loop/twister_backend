import type { InventoryBalanceModel } from '@/src/inventories/application/models/inventory-balance.model';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isInventoryBalanceModel = (value: unknown): value is InventoryBalanceModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_inventory_balance === 'string' &&
    typeof value.quantity === 'number' &&
    typeof value.id_location_inventory === 'string' &&
    typeof value.id_product === 'string'
  );
};