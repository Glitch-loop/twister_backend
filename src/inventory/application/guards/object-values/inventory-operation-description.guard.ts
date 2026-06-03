import type { InventoryOperationDescriptionModel } from '@/src/inventory/application/models/inventory-operation-description.model';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isInventoryOperationDescriptionModel = (
  value: unknown,
): value is InventoryOperationDescriptionModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_product_operation_description === 'string' &&
    typeof value.price_at_moment === 'number' &&
    typeof value.cost_at_moment === 'number' &&
    typeof value.quantity === 'number' &&
    typeof value.id_inventory_operation === 'string' &&
    typeof value.id_product === 'string'
  );
};