import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { InventoryBalanceDto } from '@/src/inventories/application/dtos/inventory-balance.dto';

export class InventoryDto {
  @ApiProperty({ type: String, format: 'uuid', example: '8d4c3b2a-1f0e-4d9c-8b7a-6e5d4c3b2a10' })
  public readonly id_inventory: string;

  @ApiProperty({ type: Number, example: 1 })
  public readonly inventory_context: number;

  @ApiProperty({ type: String, example: 'Central warehouse' })
  public readonly inventory_name: string;

  @ApiProperty({ type: Number, example: 1 })
  public readonly is_active: number;

  @ApiProperty({ type: String, format: 'date-time', example: '2026-06-03T09:15:00.000Z' })
  public readonly updated_at: Date;

  @ApiProperty({ type: String, format: 'date-time', example: '2026-06-03T09:15:00.000Z' })
  public readonly created_at: Date;

  @ApiProperty({ type: String, format: 'uuid', example: '0a1b2c3d-4e5f-6789-abcd-ef0123456789' })
  public readonly created_by: string;

  @ApiPropertyOptional({ type: String, format: 'uuid', example: '11111111-2222-3333-4444-555555555555' })
  public readonly assigned_facility: string|null;

  @ApiPropertyOptional({ type: String, format: 'uuid', example: '66666666-7777-8888-9999-000000000000' })
  public readonly assigned_to: string|null;

  @ApiProperty({ type: [InventoryBalanceDto] })
  public readonly inventory_balance: InventoryBalanceDto[];

  constructor(
    id_inventory: string,
    inventory_context: number,
    inventory_name: string,
    is_active: number,
    created_at: Date,
    updated_at: Date,
    created_by: string,
    inventory_balance: InventoryBalanceDto[],
    assigned_facility: string | null,
    assigned_to: string | null,
  ) {
    this.id_inventory = id_inventory;
    this.inventory_context = inventory_context;
    this.inventory_name = inventory_name;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.created_by = created_by;
    this.assigned_facility = assigned_facility;
    this.assigned_to = assigned_to;
    this.inventory_balance = inventory_balance;
  }
}