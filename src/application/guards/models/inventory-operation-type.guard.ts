import type { InventoryOperationTypeModel } from '../../models/inventory-operation-type.model';

import { isRecord } from '../utils';

export const isInventoryOperationTypeModel = (value: unknown): value is InventoryOperationTypeModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_inventory_operation_type === 'string' &&
    typeof value.inventory_operation_type_name === 'string'
  );
};
