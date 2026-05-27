import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RouteDto {
  @ApiProperty({ type: String, format: 'uuid', example: '4a7ce6fa-f96f-4e3f-b3d5-1f7bcb4f4f8f' })
  public readonly id_route: string;

  @ApiProperty({ type: String, example: 'Downtown morning route' })
  public readonly route_name: string;

  @ApiPropertyOptional({ type: String, example: 'Primary route for downtown deliveries' })
  public readonly description?: string;

  constructor(id_route: string, route_name: string, description?: string) {
    this.id_route = id_route;
    this.route_name = route_name;
    this.description = description;
  }
}
 