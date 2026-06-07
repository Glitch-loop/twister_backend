import { ApiProperty } from '@nestjs/swagger';

export class ProductInventoryBalanceLimitsRequestDto {
  @ApiProperty({ type: String, format: 'uuid', example: '2c4d6e8f-0123-4b56-9c78-9d0e1f2a3456' })
  public readonly id_product: string;

  @ApiProperty({ type: Number, example: 12 })
  public readonly min_quantity: number | null;

  @ApiProperty({ type: Number, example: 12 })
  public readonly max_quantity: number | null;

  constructor(
    _id_product: string,
    _min_quantity: number|null,
    _max_quantity: number|null,
  ) {
    this.id_product = _id_product;
    this.min_quantity = _min_quantity;
    this.max_quantity = _max_quantity;
  }
}