import type { InventoryBalanceDto } from '@/src/inventories/application/dtos/inventory-balance.dto';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isInventoryBalanceDto = (value: unknown): value is InventoryBalanceDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_inventory_balance === 'string' &&
    typeof value.quantity === 'number' &&
    (typeof value.min_quantity === 'number' || value.min_quantity === null) &&
    (typeof value.max_quantity === 'number' || value.max_quantity === null) &&
    typeof value.created_at === 'string' &&
    typeof value.id_inventory === 'string' &&
    typeof value.id_product === 'string'
  );
};