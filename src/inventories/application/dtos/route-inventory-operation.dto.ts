import { ApiProperty } from '@nestjs/swagger';
import { RouteInventoryOperationDescriptionDto } from "@/src/inventories/application/dtos/route-inventory-operation-description.dto";


export class RouteInventoryOperationDto {
  @ApiProperty({ type: String, format: 'uuid', example: 'd047f38a-f6f1-4df0-861a-6b55b2a28f67' })
  public readonly id_inventory_operation: string;

  @ApiProperty({ type: String, format: 'date-time', example: '2026-06-03T09:15:00.000Z' })
  public readonly date: string;

  @ApiProperty({ type: String, format: 'uuid', example: 'cfbe7fb4-39ef-4c30-9c34-6f1d6f9b6b66' })
  public readonly id_inventory_operation_type: string;

  @ApiProperty({ type: String, format: 'uuid', example: 'f6f5f6d3-7449-4d8d-95f7-8294829f1abc' })
  public readonly id_work_day: string;

  @ApiProperty({ type: String, format: 'uuid', example: '90f9f028-df9d-4e1d-b59e-f465cc6ec778' })
  public readonly id_user: string;

  @ApiProperty({ type: [RouteInventoryOperationDescriptionDto] })
  public readonly inventory_operation_descriptions: RouteInventoryOperationDescriptionDto[];

  constructor(
    id_inventory_operation: string,
    date: string,
    id_inventory_operation_type: string,
    id_work_day: string,
    id_user: string,
    inventory_operation_descriptions: RouteInventoryOperationDescriptionDto[],
  ) {
    this.id_inventory_operation = id_inventory_operation;
    this.date = date;
    this.id_inventory_operation_type = id_inventory_operation_type;
    this.id_work_day = id_work_day;
    this.id_user = id_user;
    this.inventory_operation_descriptions = inventory_operation_descriptions;
  }
}