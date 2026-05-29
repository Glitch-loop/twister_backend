import { ApiProperty } from '@nestjs/swagger';

export class OrganizationStrategyDto {
  @ApiProperty({ type: String, format: 'uuid', example: '7ac6d30f-c9d5-4fcb-a628-dfc88ce89d7f' })
  public readonly id_organization_strategy: string;

  @ApiProperty({ type: String, example: 'ByPriorityAndDistance' })
  public readonly organization_strategy_name: string;

  @ApiProperty({ type: Number, example: 1, description: '1 when this strategy is selected, otherwise 0.' })
  public readonly is_used: number;

  @ApiProperty({ type: String, format: 'date-time', example: '2026-05-28T10:30:00.000Z' })
  public readonly created_at: Date;

  constructor(
    id_organization_strategy: string,
    organization_strategy_name: string,
    is_used: number,
    created_at: Date,
  ) {
    this.id_organization_strategy = id_organization_strategy;
    this.organization_strategy_name = organization_strategy_name;
    this.is_used = is_used;
    this.created_at = created_at;
  }
}
