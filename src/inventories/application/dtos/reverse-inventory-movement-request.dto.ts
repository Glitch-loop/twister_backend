import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { InventoryOperationDescriptionRequestDto } from '@/src/inventories/application/dtos/inventory-operation-request.dto';

export class ReverseInventoryMovementRequestDto {
  @ApiProperty({ type: String, format: 'uuid' })
  public readonly id_inventory_origin: string = '';

  @ApiProperty({ type: String, format: 'uuid' })
  public readonly id_inventory_target: string = '';

  @ApiProperty({ type: String, format: 'uuid' })
  public readonly id_inventory_operation_to_reverse: string = '';

  @ApiProperty({ type: String, format: 'uuid' })
  public readonly created_by: string = '';

  @ApiProperty({ type: [InventoryOperationDescriptionRequestDto] })
  public readonly inventory_operation_descriptions: InventoryOperationDescriptionRequestDto[] = [];

  @ApiPropertyOptional({ type: String, format: 'uuid' })
  public readonly id_inventory_operation?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  public readonly created_at?: Date;

  @ApiPropertyOptional({ type: String })
  public readonly latitude?: string;

  @ApiPropertyOptional({ type: String })
  public readonly longitude?: string;

  constructor(
    id_inventory_origin: string,
    id_inventory_target: string,
    id_inventory_operation_to_reverse: string,
    created_by: string,
    inventory_operation_descriptions: InventoryOperationDescriptionRequestDto[],
    id_inventory_operation?: string,
    created_at?: Date,
    latitude?: string,
    longitude?: string,
  ) {
    this.id_inventory_origin = id_inventory_origin;
    this.id_inventory_target = id_inventory_target;
    this.id_inventory_operation_to_reverse = id_inventory_operation_to_reverse;
    this.created_by = created_by;
    this.inventory_operation_descriptions = inventory_operation_descriptions;
    this.id_inventory_operation = id_inventory_operation;
    this.created_at = created_at;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
