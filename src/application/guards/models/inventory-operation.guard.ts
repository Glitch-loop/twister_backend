import type { InventoryOperationModel } from '@/src/application/models/inventory-operation.model';

import { isRecord } from '@/src/shared/guards/utils';

export const isInventoryOperationModel = (value: unknown): value is InventoryOperationModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_inventory_operation === 'string' &&
    typeof value.sign_confirmation === 'string' &&
    value.date instanceof Date &&
    typeof value.audit === 'number' &&
    typeof value.id_inventory_operation_type === 'string' &&
    typeof value.id_work_day === 'string' &&
    typeof value.state === 'number'
  );
};
