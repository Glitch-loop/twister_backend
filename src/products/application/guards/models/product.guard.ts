import type { ProductModel } from '@/src/products/application/models/product.model';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isProductModel = (value: unknown): value is ProductModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_product === 'string' &&
    typeof value.product_name === 'string' &&
    (value.barcode === null || typeof value.barcode === 'string') &&
    typeof value.cost === 'number' &&
    typeof value.product_status === 'number' &&
    typeof value.quantity_presentation === 'number' &&
    typeof value.order_to_show === 'number' &&
    typeof value.id_measurement_unit === 'string'
  );
};
