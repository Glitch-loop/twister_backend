import { ApiProperty } from '@nestjs/swagger';

export class InventoryBalanceDto {
  @ApiProperty({ type: String, format: 'uuid', example: 'b55b7c1e-6e88-4a5f-9b2a-2d3f1b6c5e10' })
  public readonly id_inventory_balance: string;

  @ApiProperty({ type: Number, example: 48.75 })
  public readonly quantity: number;

  @ApiProperty({ type: Number, example: 10 })
  public readonly min_quantity: number | null;

  @ApiProperty({ type: Number, example: 100 })
  public readonly max_quantity: number | null;

  @ApiProperty({ type: String, format: 'date-time', example: '2026-06-03T09:15:00.000Z' })
  public readonly created_at: string;

  @ApiProperty({ type: String, format: 'uuid', example: '1b3c5d7e-9f01-4a23-8b45-6c7d8e9f0123' })
  public readonly id_inventory: string;

  @ApiProperty({ type: String, format: 'uuid', example: '2c4d6e8f-0123-4b56-9c78-9d0e1f2a3456' })
  public readonly id_product: string;

  constructor(
    _id_inventory_balance: string,
    _quantity: number,
    _min_quantity: number|null,
    _max_quantity: number|null,
    _created_at: string,
    _id_inventory: string,
    _id_product: string,
  ) {
    /*
      Design note (07-01-26)

      An inventory balance might not have limit for minimum and maximum quantity,
      the abscence is expressed as null.

      So, although it is possible to let these fields "undefiend":
       - min_quantity 
       - max_quantity 

      It was preferred to explicitly let the as null to indicate in requests or responses
      that the inventory balance doesn't have a limit.
    */
    this.id_inventory_balance = _id_inventory_balance;
    this.quantity = _quantity;
    this.min_quantity = _min_quantity;
    this.max_quantity = _max_quantity;
    this.created_at = _created_at;
    this.id_inventory = _id_inventory;
    this.id_product = _id_product;
  }
}