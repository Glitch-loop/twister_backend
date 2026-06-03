import type { InventoryModel } from '@/src/inventory/application/models/inventory.model';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isInventoryModel = (value: unknown): value is InventoryModel => {
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
    (value.assigned_factory === undefined || typeof value.assigned_factory === 'string')
  );
};