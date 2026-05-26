import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLocationRequest {
  @ApiProperty({ type: String, example: 'f4c9b6fd-3d5a-4f4f-9c5a-5f2c0e2ebc41' })
  public readonly id_location: string;

  @ApiProperty({ type: String, example: 'Main street' })
  public readonly street: string;

  @ApiProperty({ type: String, example: '123A' })
  public readonly ext_number: string;

  @ApiProperty({ type: String, example: 'Downtown' })
  public readonly colony: string;

  @ApiProperty({ type: String, example: '48327' })
  public readonly postal_code: string;

  @ApiProperty({ type: String, example: 'Warehouse branch' })
  public readonly location_name: string;

  @ApiProperty({ type: String, example: '19.432608' })
  public readonly latitude: string;

  @ApiProperty({ type: String, example: '-99.133209' })
  public readonly longitude: string;

  @ApiProperty({ type: Number, example: 1 })
  public readonly status_location: number;

  @ApiProperty({ type: String, example: 'a188c43a-0397-474a-a3ce-b4ee041a1cc5' })
  public readonly id_creator: string;

  @ApiProperty({ type: String, example: 'b4c5d6e7-f8a9-40bc-91de-123456789abc' })
  public readonly id_client: string;

  @ApiProperty({ type: String, example: 'c6d7e8f9-0123-4567-89ab-cdef01234567' })
  public readonly id_location_type: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-05-12T23:11:27.272Z',
  })
  public readonly created_at: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-05-13T10:20:30.123Z',
  })
  public readonly updated_at: Date;

  @ApiPropertyOptional({ type: String, example: 'Near the rear entrance' })
  public readonly address_reference?: string;

  constructor(
    id_location: string,
    street: string,
    ext_number: string,
    colony: string,
    postal_code: string,
    location_name: string,
    latitude: string,
    longitude: string,
    status_location: number,
    id_creator: string,
    id_client: string,
    id_location_type: string,
    created_at: Date,
    updated_at: Date,
    address_reference?: string,
  ) {
    this.id_location = id_location;
    this.street = street;
    this.ext_number = ext_number;
    this.colony = colony;
    this.postal_code = postal_code;
    this.location_name = location_name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.status_location = status_location;
    this.id_creator = id_creator;
    this.id_client = id_client;
    this.id_location_type = id_location_type;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.address_reference = address_reference;
  }
}
