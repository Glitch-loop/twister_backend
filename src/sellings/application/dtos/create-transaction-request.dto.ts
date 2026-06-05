// Libraries
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// enums
import { ROUTE_TRANSACTION_OPERATION_TYPE } from '@/src/sellings/core/enums/route-transaction-operation-type.enum';


export class CreateTransactionDescriptionRequestDto {
  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    example: '',
    description: 'Optional transaction description UUID. If not provided, server generates it.',
  })
  public readonly id_transaction_description?: string;

  @ApiProperty({ type: Number, example: 125.5 })
  public readonly price_at_moment: number;

  @ApiProperty({ type: Number, example: 85.75 })
  public readonly cost_at_moment: number;

  @ApiProperty({ type: Number, example: 3 })
  public readonly amount: number;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2026-06-01T12:30:00.000Z',
    description: 'Optional creation date. If not provided, server uses current date.',
  })
  public readonly created_at?: Date;

  @ApiProperty({
    type: String,
    format: 'uuid',
    enum: Object.values(ROUTE_TRANSACTION_OPERATION_TYPE),
    example: ROUTE_TRANSACTION_OPERATION_TYPE.SALES,
    description: 'Transaction operation type ID.',
  })
  public readonly id_transaction_operation_type: string;

  @ApiProperty({
    type: String,
    format: 'uuid',
    example: '',
    description: 'Product ID. Leave blank if unknown and complete later.',
  })
  public readonly id_product: string;

  constructor(
    price_at_moment: number,
    cost_at_moment: number,
    amount: number,
    id_transaction_operation_type: string,
    id_product: string,
    id_transaction_description?: string,
    created_at?: Date,
  ) {
    this.id_transaction_description = id_transaction_description;
    this.price_at_moment = price_at_moment;
    this.cost_at_moment = cost_at_moment;
    this.amount = amount;
    this.created_at = created_at;
    this.id_transaction_operation_type = id_transaction_operation_type;
    this.id_product = id_product;
  }
}

export class CreateTransactionRequestDto {
  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    example: '',
    description: 'Optional transaction UUID. If not provided, server generates it.',
  })
  public readonly id_transaction?: string;

  @ApiPropertyOptional({ type: String, example: 'ABCD010101ABC' })
  public readonly cfdi?: string;

  @ApiProperty({ type: Number, example: 456.25 })
  public readonly received_amount: number;

  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    example: '',
    description: 'Invoice concept ID. Leave blank if unknown and complete later.',
  })
  public readonly id_invoice_concept?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2026-06-01T12:30:00.000Z',
    description: 'Optional creation date. If not provided, server uses current date.',
  })
  public readonly created_at?: Date;

  @ApiPropertyOptional({
    type: String,
    example: '19.432608',
    description: 'Latitude. Required by current domain model; send empty string if unknown.',
  })
  public readonly latitude?: string;

  @ApiPropertyOptional({
    type: String,
    example: '-99.133209',
    description: 'Longitude. Required by current domain model; send empty string if unknown.',
  })
  public readonly longitude?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    example: '',
    description: 'Location ID. Leave blank if unknown and complete later.',
  })
  public readonly id_location?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    example: '',
    description: 'Client ID.',
  })
  public readonly id_client?: string;

  @ApiProperty({
    type: String,
    format: 'uuid',
    example: '',
    description: 'Work day ID.',
  })
  public readonly id_work_day: string;

  @ApiProperty({
    type: String,
    format: 'uuid',
    example: '52757755-1471-44c3-b6d5-07f7f83a0f6f',
    description: 'Payment method ID.',
  })
  public readonly id_payment_method: string;

  @ApiProperty({
    type: String,
    format: 'uuid',
    example: '0184d0e0-c9b6-4758-b757-dea6adb28bc5',
    description: 'Payment schema ID.',
  })
  public readonly id_payment_schema: string;

  @ApiProperty({
    type: [CreateTransactionDescriptionRequestDto],
    example: [
      {
        id_transaction_description: '',
        price_at_moment: 125.5,
        cost_at_moment: 85.75,
        amount: 3,
        created_at: '2026-06-01T12:30:00.000Z',
        id_transaction_operation_type: ROUTE_TRANSACTION_OPERATION_TYPE.SALES,
        id_product: '',
      },
    ],
  })
  public readonly transaction_descriptions: CreateTransactionDescriptionRequestDto[];

  constructor(
    received_amount: number,
    id_work_day: string,
    id_payment_method: string,
    id_payment_schema: string,
    transaction_descriptions: CreateTransactionDescriptionRequestDto[],
    id_invoice_concept?: string,
    latitude?: string,
    longitude?: string,
    id_client?: string,
    id_transaction?: string,
    created_at?: Date,
    id_location?: string,
    cfdi?: string,
  ) {
    this.id_transaction = id_transaction;
    this.cfdi = cfdi;
    this.received_amount = received_amount;
    this.id_invoice_concept = id_invoice_concept;
    this.created_at = created_at;
    this.latitude = latitude;
    this.longitude = longitude;
    this.id_location = id_location;
    this.id_client = id_client;
    this.id_work_day = id_work_day;
    this.id_payment_method = id_payment_method;
    this.id_payment_schema = id_payment_schema;
    this.transaction_descriptions = transaction_descriptions;
  }
}
