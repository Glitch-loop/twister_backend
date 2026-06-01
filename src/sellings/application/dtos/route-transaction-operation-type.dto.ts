import { ApiProperty } from '@nestjs/swagger';

export class RouteTransactionOperationTypeDto {
  @ApiProperty({ type: String, format: 'uuid', example: '01799558-2ab4-410f-b0b3-35cb8e63be78' })
  public readonly id_route_transaction_operation_type: string;

  @ApiProperty({ type: String, example: 'Sale' })
  public readonly transcation_operation_type_name: string;

  constructor(
    id_route_transaction_operation_type: string,
    transcation_operation_type_name: string,
  ) {
    this.id_route_transaction_operation_type = id_route_transaction_operation_type;
    this.transcation_operation_type_name = transcation_operation_type_name;
  }
}
