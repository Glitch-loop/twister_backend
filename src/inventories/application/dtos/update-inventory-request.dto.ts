import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInventoryRequestDto {
  @ApiPropertyOptional({ type: String, example: 'Warehouse CDMX - Updated' })
  public readonly inventory_name: string;

  @ApiPropertyOptional({ type: String, example: '1' })
  public readonly stock_validation?: number;

  constructor(
    _inventory_name: string,
    _stock_validation: number,
  ) {
    this.inventory_name = _inventory_name;
    this.stock_validation = _stock_validation;
  }
}
