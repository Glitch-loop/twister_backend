import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { InventoryOperationDescriptionRequestDto } from '@/src/inventories/application/dtos/inventory-operation-request.dto';

export class RegisterInventoryOperationBetweenInventoriesRequestDto {
  @ApiProperty({ type: String, format: 'uuid' })
  public readonly id_inventory_origin: string;

  @ApiProperty({ type: String, format: 'uuid' })
  public readonly id_inventory_destination: string;

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
