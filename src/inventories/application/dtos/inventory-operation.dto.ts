import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { InventoryOperationDescriptionDto } from '@/src/inventories/application/dtos/inventory-operation-description.dto';

export class InventoryOperationDto {
  @ApiProperty({ type: String, format: 'uuid', example: 'a1b2c3d4-e5f6-4789-abcd-1234567890ab' })
  public readonly id_inventory_operation: string;

  @ApiProperty({ type: Number, example: 1 })
  public readonly movement_type: number;

  @ApiProperty({ type: String, format: 'date-time', example: '2026-06-03T09:15:00.000Z' })
  public readonly created_at: string;

  @ApiProperty({ type: String, format: 'uuid', example: '0a1b2c3d-4e5f-6789-abcd-ef0123456789' })
  public readonly created_by: string;

  @ApiProperty({ type: String, format: 'uuid', example: '8d4c3b2a-1f0e-4d9c-8b7a-6e5d4c3b2a10' })
  public readonly id_inventory_origin: string;

  @ApiProperty({ type: String, format: 'uuid', example: '8d4c3b2a-1f0e-4d9c-8b7a-6e5d4c3b2a11' })
  public readonly id_inventory_target: string;

  @ApiProperty({ type: [InventoryOperationDescriptionDto] })
  public readonly inventory_operation_descriptions: InventoryOperationDescriptionDto[];

  @ApiPropertyOptional({ type: String, format: 'double', example: '19.432608' })
  public readonly latitude?: string | null;

  @ApiPropertyOptional({ type: String, format: 'double', example: '-99.133209' })
  public readonly longitude?: string | null;

  @ApiPropertyOptional({ type: String, format: 'uuid', example: 'b2c3d4e5-f678-49ab-cdef-234567890abc' })
  public readonly inventory_operation_reference?: string | null;

  @ApiPropertyOptional({ type: String, format: 'uuid', example: 'c3d4e5f6-7890-4abc-def1-34567890abcd' })
  public readonly document_reference?: string | null;

  constructor(
    id_inventory_operation: string,
    movement_type: number,
    created_at: string,
    created_by: string,
    id_inventory_origin: string,
    id_inventory_target: string,
    inventory_operation_descriptions: InventoryOperationDescriptionDto[],
    latitude?: string | null,
    longitude?: string | null,
    inventory_operation_reference?: string|null,
    document_reference?: string|null,
  ) {
    this.id_inventory_operation = id_inventory_operation;
    this.movement_type = movement_type;
    this.created_at = created_at;
    this.created_by = created_by;
    this.id_inventory_origin = id_inventory_origin;
    this.id_inventory_target = id_inventory_target;
    this.inventory_operation_descriptions = inventory_operation_descriptions;
    this.latitude = latitude;
    this.longitude = longitude;
    this.inventory_operation_reference = inventory_operation_reference;
    this.document_reference = document_reference;
  }
}