import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RouteRequestDto {
  @ApiProperty({ type: String, example: 'Morning route - North zone' })
  public route_name: string;

  @ApiPropertyOptional({ type: String, example: 'Covers downtown and industrial area deliveries.' })
  public description?: string;

  constructor(
    private readonly _route_name: string,
    private readonly _description?: string,
  ) {
    this.route_name = _route_name;
    this.description = _description;
  }
}
