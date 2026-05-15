import type { InventoryOperationTypeObjectValue } from '@/src/core/object-values/inventory-operation-type.object-value';
import { isRecord } from '@/src/shared/guards/utils';

export const isInventoryOperationTypeObjectValue = (value: unknown): value is InventoryOperationTypeObjectValue => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.inventory_operation_type_name === 'string' &&
    typeof value.id_inventory_operation_type === 'string'
  );
};