import type { InventoryOperationDto } from '@/src/inventories/application/dtos/inventory-operation.dto';

import { isArray, isRecord } from '@/src/shared/application/guards/utils';

import { isInventoryOperationDescriptionDto } from '@/src/inventories/application/guards/dtos/inventory-operation-description.guard';

export const isInventoryOperationDto = (value: unknown): value is InventoryOperationDto => {
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
    isArray(value.inventory_operation_descriptions) && value.inventory_operation_descriptions.every(isInventoryOperationDescriptionDto) &&
    (value.latitude === undefined || value.latitude === null || typeof value.latitude === 'string') &&
    (value.longitude === undefined || value.longitude === null || typeof value.longitude === 'string') &&
    (value.inventory_operation_reference === undefined || value.inventory_operation_reference === null || typeof value.inventory_operation_reference === 'string') &&
    (value.document_reference === undefined || value.document_reference === null || typeof value.document_reference === 'string')
  );
};