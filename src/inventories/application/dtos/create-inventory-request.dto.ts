import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { INVENTORY_CONTEXT_ENUM } from '@/src/inventories/core/enums/inventory-context.enum';

export class CreateInventoryRequestDto {
  @ApiProperty({ type: Number, enum: INVENTORY_CONTEXT_ENUM, example: INVENTORY_CONTEXT_ENUM.WAREHOUSE })
  public readonly inventory_context: INVENTORY_CONTEXT_ENUM;

  @ApiProperty({ type: String, example: 'Warehouse Monterrey' })
  public readonly inventory_name: string;

  @ApiProperty({ type: String, format: 'uuid' })
  public readonly created_by: string;

  @ApiPropertyOptional({ type: String, example: '1' })
  public readonly stock_validation?: number;

  @ApiPropertyOptional({ type: String, format: 'uuid' })
  public readonly assigned_to?: string;

  @ApiPropertyOptional({ type: String, format: 'uuid' })
  public readonly assigned_facility?: string;

  @ApiPropertyOptional({ type: String, format: 'uuid' })
  public readonly id_inventory?: string;

  constructor(
    _inventory_context: INVENTORY_CONTEXT_ENUM,
    _inventory_name: string,
    _created_by: string,
    _stock_validation?: number,
    _assigned_to?: string,
    _assigned_facility?: string,
    _id_inventory?: string,
  ) {
    this.inventory_context = _inventory_context
    this.inventory_name = _inventory_name
    this.created_by = _created_by
    this.stock_validation = _stock_validation
    this.assigned_to = _assigned_to
    this.assigned_facility = _assigned_facility
    this.id_inventory = _id_inventory
  }
}
