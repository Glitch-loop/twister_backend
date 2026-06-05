import { ApiProperty } from '@nestjs/swagger';

export class RetrieveInventoryOperationsByIdRequestDto {
  @ApiProperty({
    type: [String],
    format: 'uuid',
    example: ['a1b2c3d4-e5f6-4789-abcd-1234567890ab'],
  })
  public readonly id_inventory_operation: string[];
}
