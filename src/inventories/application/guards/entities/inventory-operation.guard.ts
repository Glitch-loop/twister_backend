// Entities
import type { InventoryOperationEntity } from '@/src/inventories/core/entities/inventory-operation.entity';

// Utils
import { isArray, isRecord } from '@/src/shared/application/guards/utils';

// Object values
import { isInventoryOperationDescriptionObjectValue } from '@/src/inventories/application/guards/object-values/inventory-operation-description.guard';

// Enums
import { MOVEMENT_TYPE_ENUM } from '@/src/inventories/core/enums/movement-type.enum';

export const isInventoryOperationEntity = (value: unknown): value is InventoryOperationEntity => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_inventory_operation === 'string' &&
    (value.latitude === null || typeof value.latitude === 'string') &&
    (value.longitude === null || typeof value.longitude === 'string') &&
    typeof value.movement_type === 'number' && Object.values(MOVEMENT_TYPE_ENUM).includes(value.movement_type) &&
    value.created_at instanceof Date &&
    typeof value.created_by === 'string' &&
    typeof value.id_inventory_origin === 'string' &&
    typeof value.id_inventory_target === 'string' &&
    isArray(value.inventory_operation_descriptions) && value.inventory_operation_descriptions.every(isInventoryOperationDescriptionObjectValue) &&
    (value.inventory_operation_reference === null || typeof value.inventory_operation_reference === 'string') &&
    (value.document_reference === null || typeof value.document_reference === 'string')
  );
};