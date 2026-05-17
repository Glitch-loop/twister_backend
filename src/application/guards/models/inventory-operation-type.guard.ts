import type { InventoryOperationTypeModel } from '@/src/application/models/inventory-operation-type.model';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isInventoryOperationTypeModel = (value: unknown): value is InventoryOperationTypeModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_inventory_operation_type === 'string' &&
    typeof value.inventory_operation_type_name === 'string'
  );
};
