import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { INVENTORY_CONTEXT_ENUM } from '@/src/inventories/core/enums/inventory-context.enum';

export class CreateInventoryRequestDto {
  @ApiProperty({ type: Number, enum: INVENTORY_CONTEXT_ENUM, example: INVENTORY_CONTEXT_ENUM.WAREHOUSE })
  public readonly inventory_context: INVENTORY_CONTEXT_ENUM;

  @ApiProperty({ type: String, example: 'Warehouse Monterrey' })
  public readonly inventory_name: string;

  @ApiProperty({ type: String, format: 'uuid' })
  public readonly created_by: string;

  @ApiPropertyOptional({ type: String, format: 'uuid' })
  public readonly assigned_to?: string;

  @ApiPropertyOptional({ type: String, format: 'uuid' })
  public readonly assigned_facility?: string;

  @ApiPropertyOptional({ type: String, format: 'uuid' })
  public readonly id_inventory?: string;
}
