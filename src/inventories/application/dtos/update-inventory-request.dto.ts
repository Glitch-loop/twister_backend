// Libraries
import { ApiPropertyOptional } from '@nestjs/swagger';

// Dto
import { ProductInventoryBalanceLimitsRequestDto } from '@/src/inventories/application/dtos/product-inventory-balance-limits-request.dto';

export class UpdateInventoryRequestDto {
  @ApiPropertyOptional({ type: String, example: 'Warehouse CDMX - Updated' })
  public readonly inventory_name: string;

  @ApiPropertyOptional({ type: String, example: '1' })
  public readonly stock_validation?: number;

  @ApiPropertyOptional({ type: [ProductInventoryBalanceLimitsRequestDto] })
  public readonly products_limits?: ProductInventoryBalanceLimitsRequestDto[];

  constructor(
    _inventory_name: string,
    _stock_validation?: number,
    _products_limits?: ProductInventoryBalanceLimitsRequestDto[],
  ) {
    this.inventory_name = _inventory_name;
    this.stock_validation = _stock_validation;
    this.products_limits = _products_limits;
  }
}
