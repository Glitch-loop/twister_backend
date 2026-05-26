import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductPriceDto {
  @ApiProperty({ type: String, example: '6f7a8b9c-1d2e-4f50-8a9b-c0d1e2f34567' })
  public readonly id_product_price: string;

  @ApiProperty({ type: Number, example: 120.5 })
  public readonly price: number;

  @ApiProperty({ type: String, format: 'date-time', example: '2026-05-25T12:30:00.000Z' })
  public readonly created_at: Date;

  @ApiPropertyOptional({ type: String, example: '53dc3ca4-f9db-4c22-86b6-8f71fc562dc5' })
  public readonly id_client?: string;

  @ApiPropertyOptional({ type: String, example: 'f4c9b6fd-3d5a-4f4f-9c5a-5f2c0e2ebc41' })
  public readonly id_location?: string;

  @ApiPropertyOptional({ type: String, example: 'c6d7e8f9-0123-4567-89ab-cdef01234567' })
  public readonly id_route_day?: string;

  constructor(
    id_product_price: string,
    price: number,
    created_at: Date,
    id_client?: string,
    id_location?: string,
    id_route_day?: string,
  ) {
    this.id_product_price = id_product_price;
    this.price = price;
    this.created_at = created_at;
    this.id_client = id_client;
    this.id_location = id_location;
    this.id_route_day = id_route_day;
  }
}
