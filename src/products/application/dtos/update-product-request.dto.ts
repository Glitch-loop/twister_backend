import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductRequestDto {
  @ApiPropertyOptional({ type: String, example: 'Soda Bottle 600ml' })
  public readonly product_name?: string;

  @ApiPropertyOptional({ type: Number, example: 25 })
  public readonly cost?: number;

  @ApiPropertyOptional({ type: Number, example: 600 })
  public readonly quantity_presentation?: number;

  @ApiPropertyOptional({ type: Number, example: 10 })
  public readonly order_to_show?: number;

  @ApiPropertyOptional({ type: String, example: 'a188c43a-0397-474a-a3ce-b4ee041a1cc5' })
  public readonly id_measurement_unit?: string;

  @ApiPropertyOptional({ type: String, example: '7501020512345' })
  public readonly barcode?: string;

  constructor(
    product_name?: string,
    cost?: number,
    quantity_presentation?: number,
    order_to_show?: number,
    id_measurement_unit?: string,
    barcode?: string,
  ) {
    this.product_name = product_name;
    this.cost = cost;
    this.quantity_presentation = quantity_presentation;
    this.order_to_show = order_to_show;
    this.id_measurement_unit = id_measurement_unit;
    this.barcode = barcode;
  }
}
