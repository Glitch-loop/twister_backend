import { ApiProperty } from '@nestjs/swagger';

export class PaymentMethodDto {
  @ApiProperty({ type: String, format: 'uuid', example: 'f4d6a83f-b267-4892-b709-2ef9ad70d8ce' })
  public readonly id_payment_method: string;

  @ApiProperty({ type: String, example: 'Cash' })
  public readonly payment_method_name: string;

  constructor(id_payment_method: string, payment_method_name: string) {
    this.id_payment_method = id_payment_method;
    this.payment_method_name = payment_method_name;
  }
}
