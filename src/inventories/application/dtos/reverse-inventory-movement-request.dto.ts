import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReverseInventoryMovementRequestDto {
  @ApiProperty({ type: String, format: 'uuid' })
  public readonly id_inventory_operation_to_reverse: string;

  @ApiProperty({ type: String, format: 'uuid' })
  public readonly reversed_by: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  public readonly created_at?: Date;

  @ApiPropertyOptional({ type: String })
  public readonly latitude?: string;

  @ApiPropertyOptional({ type: String })
  public readonly longitude?: string;

  constructor(
    id_inventory_operation_to_reverse: string,
    reversed_by: string,
    created_at?: Date,
    latitude?: string,
    longitude?: string,
  ) {
    this.id_inventory_operation_to_reverse = id_inventory_operation_to_reverse;
    this.reversed_by = reversed_by;
    this.created_at = created_at;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
