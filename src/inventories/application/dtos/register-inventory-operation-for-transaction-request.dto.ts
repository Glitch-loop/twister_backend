import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { InventoryOperationDescriptionRequestDto } from '@/src/inventories/application/dtos/inventory-operation-request.dto';
import { MOVEMENT_TYPE_ENUM } from '@/src/inventories/core/enums/movement-type.enum';

export class RegisterInventoryOperationForTransactionRequestDto {
  @ApiProperty({ type: String, format: 'uuid' })
  public readonly id_inventory_origin: string;

  @ApiProperty({
    type: Number,
    enum: [MOVEMENT_TYPE_ENUM.SELLING, MOVEMENT_TYPE_ENUM.PRODUCT_REPOSITION],
    example: MOVEMENT_TYPE_ENUM.SELLING,
  })
  public readonly movement_type: MOVEMENT_TYPE_ENUM;

  @ApiProperty({ type: String, format: 'uuid' })
  public readonly document_reference: string;

  @ApiProperty({ type: String, format: 'uuid' })
  public readonly created_by: string;

  @ApiProperty({ type: [InventoryOperationDescriptionRequestDto] })
  public readonly inventory_operation_descriptions: InventoryOperationDescriptionRequestDto[];

  @ApiPropertyOptional({ type: String, format: 'uuid' })
  public readonly id_inventory_operation?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  public readonly created_at?: Date;

  @ApiPropertyOptional({ type: String })
  public readonly latitude?: string;

  @ApiPropertyOptional({ type: String })
  public readonly longitude?: string;
}
