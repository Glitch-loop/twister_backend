import type { InventoryOperationDescriptionModel } from '@/src/application/models/inventory-operation-description.model';

import { isRecord } from '@/src/application/guards/utils';

export const isInventoryOperationDescriptionModel = (value: unknown): value is InventoryOperationDescriptionModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_inventory_operation_description === 'string' &&
    typeof value.amount === 'number' &&
    typeof value.price_at_moment === 'number' &&
    typeof value.id_inventory_operation === 'string' &&
    typeof value.id_product === 'string' &&
    value.created_at instanceof Date
  );
};
