import type { InventoryEntity } from '@/src/inventories/core/entities/inventory.entity';

import { isArray, isRecord } from '@/src/shared/application/guards/utils';

import { isInventoryBalanceModel } from '@/src/inventories/application/guards/object-values/inventory-balance.guard';

export const isInventoryEntity = (value: unknown): value is InventoryEntity => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_inventory === 'string' &&
    typeof value.inventory_context === 'number' &&
    typeof value.inventory_name === 'string' &&
    typeof value.is_active === 'number' &&
    typeof value.created_by === 'string' &&
    (value.assigned_facility === undefined || typeof value.assigned_facility === 'string') &&
    (value.assigned_to === undefined || typeof value.assigned_to === 'string') &&
    isArray(value.inventory_balance) &&
    value.inventory_balance.every(isInventoryBalanceModel)
  );
};