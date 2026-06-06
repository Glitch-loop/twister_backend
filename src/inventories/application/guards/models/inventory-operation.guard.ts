import type { InventoryOperationModel } from '@/src/inventories/application/models/inventory-operation.model';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isInventoryOperationModel = (value: unknown): value is InventoryOperationModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_inventory_operation === 'string' &&
    (value.latitude === undefined || value.latitude === null || typeof value.latitude === 'string') &&
    (value.longitude === undefined || value.longitude === null || typeof value.longitude === 'string') &&
    (value.inventory_operation_reference === undefined || typeof value.inventory_operation_reference === 'string') &&
    typeof value.movement_type === 'number' &&
    (value.document_reference === undefined || typeof value.document_reference === 'string') &&
    typeof value.created_by === 'string' &&
    typeof value.id_inventory_origin === 'string' &&
    typeof value.id_inventory_target === 'string'
  );
};