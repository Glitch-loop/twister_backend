import type { ProductPriceEntity } from '@/src/core/entities/product-price.entity';
import { isRecord } from '@/src/application/guards/utils';

export const isProductPriceEntity = (value: unknown): value is ProductPriceEntity => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id_product_price === 'string' &&
    typeof value.price === 'number' &&
    value.created_at instanceof Date &&
    typeof value.id_product === 'string' &&
    (value.id_client === undefined || typeof value.id_client === 'string') &&
    (value.id_location === undefined || typeof value.id_location === 'string') &&
    (value.id_route_day === undefined || typeof value.id_route_day === 'string')
  );
};
