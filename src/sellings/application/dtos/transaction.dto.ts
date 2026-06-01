import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethodDto } from '@/src/sellings/application/dtos/payment-method.dto';
import { PaymentSchemaDto } from '@/src/sellings/application/dtos/payment-schema.dto';
import { TransactionDescriptionDto } from '@/src/sellings/application/dtos/transaction-description.dto';

export class TransactionDto {
  @ApiProperty({ type: String, format: 'uuid', example: '3e51b1f8-10f2-4f84-bf0f-e9ea7bb36c98' })
  public readonly id_transaction: string;

  @ApiPropertyOptional({ type: String, example: 'ABCD010101ABC' })
  public readonly cfdi?: string;

  @ApiProperty({ type: Number, example: 1 })
  public readonly state: number;

  @ApiProperty({ type: Number, example: 456.25 })
  public readonly received_amount: number;

  @ApiProperty({ type: String, format: 'uuid', example: '60f6edb4-2bc3-4f35-8d88-48701ae0e247' })
  public readonly id_invoice_concept: string;

  @ApiProperty({ type: String, format: 'date-time', example: '2026-06-01T12:30:00.000Z' })
  public readonly created_at: Date;

  @ApiProperty({ type: String, example: '19.432608' })
  public readonly latitude?: string;

  @ApiProperty({ type: String, example: '-99.133209' })
  public readonly longitude?: string;

  @ApiPropertyOptional({ type: String, format: 'uuid', example: 'ab935e3c-f0c8-4adf-9eb4-8ffb96a450f7' })
  public readonly id_location?: string;

  @ApiPropertyOptional({ type: String, format: 'uuid', example: '4d095283-d8c0-4ad9-b67e-09e2ea9c08be' })
  public readonly id_client?: string;

  @ApiProperty({ type: String, format: 'uuid', example: '5e8e8ad0-8a84-4326-95d5-84f4f2c13711' })
  public readonly id_work_day: string;

  @ApiProperty({
    type: PaymentMethodDto,
    example: {
      id_payment_method: 'f4d6a83f-b267-4892-b709-2ef9ad70d8ce',
      payment_method_name: 'Cash',
    },
  })
  public readonly payment_method: PaymentMethodDto;

  @ApiProperty({
    type: PaymentSchemaDto,
    example: {
      id_payment_schema: '4f8d6d09-30d8-41dc-b8d0-2f83bf1f1b86',
      payment_schema_type: 'credit',
    },
  })
  public readonly payment_schema: PaymentSchemaDto;

  @ApiProperty({
    type: [TransactionDescriptionDto],
    example: [
      {
        id_transaction_description: '20be80b1-f257-4d9d-b9f7-68e26b80ce53',
        price_at_moment: 125.5,
        cost_at_moment: 85.75,
        received_amount: 3,
        created_at: '2026-06-01T12:30:00.000Z',
        id_transaction: '3e51b1f8-10f2-4f84-bf0f-e9ea7bb36c98',
        id_transaction_operation_type: '01799558-2ab4-410f-b0b3-35cb8e63be78',
        id_product: '2be5f42f-d194-4ab2-bdfa-05f0f2a10fbc',
      },
    ],
  })
  public readonly transaction_descriptions: TransactionDescriptionDto[];

  constructor(
    id_transaction: string,
    state: number,
    received_amount: number,
    id_invoice_concept: string,
    created_at: Date,
    id_work_day: string,
    payment_method: PaymentMethodDto,
    payment_schema: PaymentSchemaDto,
    transaction_descriptions: TransactionDescriptionDto[],
    id_client?: string,
    id_location?: string,
    latitude?: string,
    longitude?: string,
    cfdi?: string,
  ) {
    this.id_transaction = id_transaction;
    this.cfdi = cfdi;
    this.state = state;
    this.received_amount = received_amount;
    this.id_invoice_concept = id_invoice_concept;
    this.created_at = created_at;
    this.latitude = latitude;
    this.longitude = longitude;
    this.id_location = id_location;
    this.id_client = id_client;
    this.id_work_day = id_work_day;
    this.payment_method = payment_method;
    this.payment_schema = payment_schema;
    this.transaction_descriptions = transaction_descriptions;
  }
}
