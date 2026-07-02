// Models
import type { InventoryOperationModel } from '@/src/inventories/application/models/inventory-operation.model';

// Utils
import { isRecord } from '@/src/shared/application/guards/utils';

export const isInventoryOperationModel = (value: unknown): value is InventoryOperationModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_inventory_operation === 'string' &&
    typeof value.movement_type === 'number' &&
    typeof value.created_at === 'string' &&
    typeof value.created_by === 'string' &&
    typeof value.id_inventory_origin === 'string' &&
    typeof value.id_inventory_target === 'string' &&
    (value.latitude === null || typeof value.latitude === 'string') &&
    (value.longitude === null || typeof value.longitude === 'string') &&
    (value.inventory_operation_reference === null || typeof value.inventory_operation_reference === 'string') &&
    (value.document_reference === null || typeof value.document_reference === 'string')
  );
};