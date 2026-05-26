import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductPriceRequestDto {
  @ApiProperty({ type: Number, example: 135.5 })
  public readonly price: number;

  @ApiPropertyOptional({ type: String, example: '53dc3ca4-f9db-4c22-86b6-8f71fc562dc5' })
  public readonly id_client?: string;

  @ApiPropertyOptional({ type: String, example: 'f4c9b6fd-3d5a-4f4f-9c5a-5f2c0e2ebc41' })
  public readonly id_location?: string;

  @ApiPropertyOptional({ type: String, example: 'c6d7e8f9-0123-4567-89ab-cdef01234567' })
  public readonly id_route_day?: string;

  constructor(
    price: number,
    id_client?: string,
    id_location?: string,
    id_route_day?: string,
  ) {
    this.price = price;
    this.id_client = id_client;
    this.id_location = id_location;
    this.id_route_day = id_route_day;
  }
}
