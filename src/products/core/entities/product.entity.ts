import { ProductPriceObjectValue } from '@/src/products/core/value-objects/product-price.object-value';
import { PRODUCT_STATUS_ENUM } from '@/src/products/core/enums/product-status.enum';

export class ProductEntity {
  constructor(
    public readonly id_product: string,
    public readonly product_name: string,
    public readonly cost: number,
    public readonly product_status: PRODUCT_STATUS_ENUM,
    public readonly quantity_presentation: number,
    public readonly order_to_show: number,
    public readonly id_measurement_unit: string,
    public readonly product_price: ProductPriceObjectValue[],
    public readonly created_at: Date,
    public readonly barcode: string | null,
  ) {}
}
