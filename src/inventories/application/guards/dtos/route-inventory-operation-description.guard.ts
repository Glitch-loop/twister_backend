import type { RouteInventoryOperationDescriptionDto } from '@/src/inventories/application/dtos/route-inventory-operation-description.dto';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isRouteInventoryOperationDescriptionDto = (
  value: unknown,
): value is RouteInventoryOperationDescriptionDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_product_operation_description === 'string' &&
    typeof value.price_at_moment === 'number' &&
    typeof value.cost_at_moment === 'number' &&
    typeof value.quantity === 'number' &&
    typeof value.id_inventory_operation === 'string' &&
    typeof value.id_product === 'string'
  );
};