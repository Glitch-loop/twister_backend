import type { ProductPriceObjectValue } from '@/src/products/core/value-objects/product-price.object-value';
import { isRecord } from '@/src/shared/application/guards/utils';

export const isProductPriceObjectValue = (value: unknown): value is ProductPriceObjectValue => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_product_price === 'string' &&
    typeof value.price === 'number' &&
    value.created_at instanceof Date
  );
};