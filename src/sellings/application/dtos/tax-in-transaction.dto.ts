import { ApiProperty } from '@nestjs/swagger';

export class TaxInTransactionDto {
  @ApiProperty({ type: String, format: 'uuid', example: 'dfd4bb02-cf05-47fa-a48e-a59a1f126f8f' })
  public readonly id_tax_in_transaction: string;

  @ApiProperty({ type: String, format: 'uuid', example: '3e51b1f8-10f2-4f84-bf0f-e9ea7bb36c98' })
  public readonly id_transaction: string;

  @ApiProperty({ type: String, format: 'uuid', example: 'bf6fef73-7505-470d-a243-f5248f4d3f6f' })
  public readonly id_tax: string;

  @ApiProperty({ type: Number, example: 16 })
  public readonly tax_rate_at_moment_of_transaction: number;

  @ApiProperty({ type: String, format: 'date-time', example: '2026-06-01T12:30:00.000Z' })
  public readonly created_at: Date;

  constructor(
    id_tax_in_transaction: string,
    id_transaction: string,
    id_tax: string,
    tax_rate_at_moment_of_transaction: number,
    created_at: Date,
  ) {
    this.id_tax_in_transaction = id_tax_in_transaction;
    this.id_transaction = id_transaction;
    this.id_tax = id_tax;
    this.tax_rate_at_moment_of_transaction = tax_rate_at_moment_of_transaction;
    this.created_at = created_at;
  }
}
