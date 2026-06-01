import { ApiProperty } from '@nestjs/swagger';

export class PaymentSchemaDto {
  @ApiProperty({ type: String, format: 'uuid', example: '4f8d6d09-30d8-41dc-b8d0-2f83bf1f1b86' })
  public readonly id_payment_schema: string;

  @ApiProperty({ type: String, example: 'credit' })
  public readonly payment_schema_type: string;

  constructor(id_payment_schema: string, payment_schema_type: string) {
    this.id_payment_schema = id_payment_schema;
    this.payment_schema_type = payment_schema_type;
  }
}
