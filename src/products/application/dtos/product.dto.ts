import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ProductPriceDto } from '@/src/products/application/dtos/product-price.dto';

export class ProductDto {
  @ApiProperty({ type: String, example: '53dc3ca4-f9db-4c22-86b6-8f71fc562dc5' })
  public readonly id_product: string;

  @ApiProperty({ type: String, example: 'Soda Bottle 600ml' })
  public readonly product_name: string;

  @ApiProperty({ type: Number, example: 25 })
  public readonly cost: number;

  @ApiProperty({ type: Number, example: 1 })
  public readonly product_status: number;

  @ApiProperty({ type: Number, example: 600 })
  public readonly quantity_presentation: number;

  @ApiProperty({ type: Number, example: 10 })
  public readonly order_to_show: number;

  @ApiProperty({ type: String, example: 'a188c43a-0397-474a-a3ce-b4ee041a1cc5' })
  public readonly id_measurement_unit: string;

  @ApiProperty({ type: ProductPriceDto, isArray: true })
  public readonly product_price: ProductPriceDto[];

  @ApiPropertyOptional({ type: String, example: '7501020512345' })
  public readonly barcode?: string;

  constructor(
    id_product: string,
    product_name: string,
    cost: number,
    product_status: number,
    quantity_presentation: number,
    order_to_show: number,
    id_measurement_unit: string,
    product_price: ProductPriceDto[],
    barcode?: string,
  ) {
    this.id_product = id_product;
    this.product_name = product_name;
    this.cost = cost;
    this.product_status = product_status;
    this.quantity_presentation = quantity_presentation;
    this.order_to_show = order_to_show;
    this.id_measurement_unit = id_measurement_unit;
    this.product_price = product_price;
    this.barcode = barcode;
  }
}
