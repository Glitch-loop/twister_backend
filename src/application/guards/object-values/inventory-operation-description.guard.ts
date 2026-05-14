import type { InventoryOperationDescriptionObjectValue } from '@/src/core/object-values/inventory-operation-description.object-value';
import { isRecord } from '@/src/application/guards/utils';

export const isInventoryOperationDescriptionObjectValue = (value: unknown): value is InventoryOperationDescriptionObjectValue => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.amount === 'number' &&
    typeof value.price_at_moment === 'number' &&
    typeof value.id_inventory_operation === 'string' &&
    typeof value.id_product === 'string' &&
    value.created_at instanceof Date &&
    typeof value.id_inventory_operation_description === 'string'
  );
};