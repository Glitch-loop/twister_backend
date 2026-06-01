import { ApiProperty } from '@nestjs/swagger';

export class TaxDto {
  @ApiProperty({ type: String, format: 'uuid', example: 'bf6fef73-7505-470d-a243-f5248f4d3f6f' })
  public readonly id_tax: string;

  @ApiProperty({ type: String, example: 'VAT' })
  public readonly tax_name: string;

  @ApiProperty({ type: String, example: '16' })
  public readonly tax_rate: string;

  @ApiProperty({ type: String, format: 'uuid', example: '3e51b1f8-10f2-4f84-bf0f-e9ea7bb36c98' })
  public readonly id_transaction: string;

  @ApiProperty({ type: String, format: 'date-time', example: '2026-06-01T12:30:00.000Z' })
  public readonly created_at: Date;

  constructor(
    id_tax: string,
    tax_name: string,
    tax_rate: string,
    id_transaction: string,
    created_at: Date,
  ) {
    this.id_tax = id_tax;
    this.tax_name = tax_name;
    this.tax_rate = tax_rate;
    this.id_transaction = id_transaction;
    this.created_at = created_at;
  }
}
