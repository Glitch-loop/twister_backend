import { ProductPriceObjectValue } from '@/src/core/object-values/product-price.object-value';

export class ProductEntity {
  constructor(
    public readonly id_product: string,
    public readonly product_name: string,
    public readonly cost: number,
    public readonly product_status: number,
    public readonly quantity_presentation: number,
    public readonly order_to_show: number,
    public readonly id_measurement_unit: string,
    public readonly product_price: ProductPriceObjectValue[],
    public readonly barcode?: string,
  ) {}
}
