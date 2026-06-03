import { ApiProperty } from '@nestjs/swagger';

export class InventoryBalanceDto {
  @ApiProperty({ type: String, format: 'uuid', example: 'b55b7c1e-6e88-4a5f-9b2a-2d3f1b6c5e10' })
  public readonly id_inventory_balance: string;

  @ApiProperty({ type: Number, example: 48.75 })
  public readonly quantity: number;

  @ApiProperty({ type: String, format: 'date-time', example: '2026-06-03T09:15:00.000Z' })
  public readonly created_at: Date;

  @ApiProperty({ type: String, format: 'uuid', example: '1b3c5d7e-9f01-4a23-8b45-6c7d8e9f0123' })
  public readonly id_location_inventory: string;

  @ApiProperty({ type: String, format: 'uuid', example: '2c4d6e8f-0123-4b56-9c78-9d0e1f2a3456' })
  public readonly id_product: string;

  constructor(
    id_inventory_balance: string,
    quantity: number,
    created_at: Date,
    id_location_inventory: string,
    id_product: string,
  ) {
    this.id_inventory_balance = id_inventory_balance;
    this.quantity = quantity;
    this.created_at = created_at;
    this.id_location_inventory = id_location_inventory;
    this.id_product = id_product;
  }
}