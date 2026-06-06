import type { InventoryDto } from '@/src/inventories/application/dtos/inventory.dto';

import { isArray, isRecord } from '@/src/shared/application/guards/utils';

import { isInventoryBalanceDto } from '@/src/inventories/application/guards/dtos/inventory-balance.guard';

export const isInventoryDto = (value: unknown): value is InventoryDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_inventory === 'string' &&
    typeof value.inventory_context === 'number' &&
    typeof value.inventory_name === 'string' &&
    typeof value.is_active === 'number' &&
    typeof value.created_by === 'string' &&
    (value.assigned_facility === null || typeof value.assigned_facility === 'string') &&
    (value.assigned_to === null || typeof value.assigned_to === 'string') &&
    isArray(value.inventory_balance) &&
    value.inventory_balance.every(isInventoryBalanceDto)
  );
};