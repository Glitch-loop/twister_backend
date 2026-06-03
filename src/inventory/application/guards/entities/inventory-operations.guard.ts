import type { InventoryOperationsEntity } from '@/src/inventory/core/entities/inventory-operations.entity';

import { isArray, isRecord } from '@/src/shared/application/guards/utils';

import { isInventoryOperationDescriptionModel } from '@/src/inventory/application/guards/object-values/inventory-operation-description.guard';

export const isInventoryOperationsEntity = (value: unknown): value is InventoryOperationsEntity => {
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
    typeof value.id_inventory_destination === 'string' &&
    isArray(value.inventory_operation_descriptions) &&
    value.inventory_operation_descriptions.every(isInventoryOperationDescriptionModel)
  );
};