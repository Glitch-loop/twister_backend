import { ApiProperty } from '@nestjs/swagger';

export class UpdateInventoryRequestDto {
  @ApiProperty({ type: String, example: 'Warehouse CDMX - Updated' })
  public readonly inventory_name: string;
}
