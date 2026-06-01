import { ApiProperty } from '@nestjs/swagger';

export class TransactionDescriptionDto {
  @ApiProperty({ type: String, format: 'uuid', example: '20be80b1-f257-4d9d-b9f7-68e26b80ce53' })
  public readonly id_transaction_description: string;

  @ApiProperty({ type: Number, example: 125.5 })
  public readonly price_at_moment: number;

  @ApiProperty({ type: Number, example: 85.75 })
  public readonly cost_at_moment: number;

  @ApiProperty({ type: Number, example: 3 })
  public readonly amount: number;

  @ApiProperty({ type: String, format: 'date-time', example: '2026-06-01T12:30:00.000Z' })
  public readonly created_at: Date;

  @ApiProperty({ type: String, format: 'uuid', example: '3e51b1f8-10f2-4f84-bf0f-e9ea7bb36c98' })
  public readonly id_transaction: string;

  @ApiProperty({ type: String, format: 'uuid', example: '01799558-2ab4-410f-b0b3-35cb8e63be78' })
  public readonly id_transaction_operation_type: string;

  @ApiProperty({ type: String, format: 'uuid', example: '2be5f42f-d194-4ab2-bdfa-05f0f2a10fbc' })
  public readonly id_product: string;

  constructor(
    id_transaction_description: string,
    price_at_moment: number,
    cost_at_moment: number,
    amount: number,
    created_at: Date,
    id_transaction: string,
    id_transaction_operation_type: string,
    id_product: string,
  ) {
    this.id_transaction_description = id_transaction_description;
    this.price_at_moment = price_at_moment;
    this.cost_at_moment = cost_at_moment;
    this.amount = amount;
    this.created_at = created_at;
    this.id_transaction = id_transaction;
    this.id_transaction_operation_type = id_transaction_operation_type;
    this.id_product = id_product;
  }
}
