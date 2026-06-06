import type { InventoryOperationDescriptionDto } from '@/src/inventories/application/dtos/inventory-operation-description.dto';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isInventoryOperationDescriptionDto = (
  value: unknown,
): value is InventoryOperationDescriptionDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_inventory_operation_description === 'string' &&
    typeof value.price_at_moment === 'number' &&
    typeof value.cost_at_moment === 'number' &&
    typeof value.quantity === 'number' &&
    typeof value.id_inventory_operation === 'string' &&
    typeof value.id_product === 'string'
  );
};