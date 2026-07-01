// Object values
import type { InventoryOperationDescriptionObjectValue } from '@/src/inventories/core/value-objects/inventory-operation-description.object-value';

// Utils
import { isRecord } from '@/src/shared/application/guards/utils';

export const isInventoryOperationDescriptionObjectValue = (value: unknown): value is InventoryOperationDescriptionObjectValue => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_inventory_operation_description === 'string' &&
    typeof value.price_at_moment === 'number' &&
    typeof value.cost_at_moment === 'number' &&
    typeof value.quantity === 'number' &&
    value.created_at instanceof Date &&
    typeof value.id_inventory_operation === 'string' &&
    typeof value.id_product === 'string'
  );
};