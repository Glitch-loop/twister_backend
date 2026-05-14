import type { ProductModel } from '../../models/product.model';

import { isRecord } from '../utils';

export const isProductModel = (value: unknown): value is ProductModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_product === 'string' &&
    typeof value.product_name === 'string' &&
    (value.barcode === undefined || typeof value.barcode === 'string') &&
    typeof value.cost === 'number' &&
    typeof value.product_status === 'number' &&
    typeof value.quantity_presentation === 'number' &&
    typeof value.order_to_show === 'number' &&
    typeof value.id_measurement_unit === 'string'
  );
};
