import type { ProductEntity } from '@/src/core/entities/product.entity';
import { isRecord } from '@/src/shared/guards/utils';

export const isProductEntity = (value: unknown): value is ProductEntity => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id_product === 'string' &&
    typeof value.product_name === 'string' &&
    typeof value.cost === 'number' &&
    typeof value.product_status === 'number' &&
    typeof value.quantity_presentation === 'number' &&
    typeof value.order_to_show === 'number' &&
    typeof value.id_measurement_unit === 'string' &&
    Array.isArray(value.product_price) &&
    (value.barcode === undefined || typeof value.barcode === 'string')
  );
};
