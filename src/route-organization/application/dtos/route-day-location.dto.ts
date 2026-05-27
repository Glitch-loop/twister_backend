
import { ApiProperty } from '@nestjs/swagger';

export class RouteDayLocationDto {
  @ApiProperty({ type: Number, example: 1 })
  public readonly position_in_route: number;

  @ApiProperty({ type: String, format: 'uuid', example: '2fbf4f06-f875-4e67-8fd8-718f76f14db3' })
  public readonly id_location: string;

  @ApiProperty({ type: String, format: 'uuid', example: '9f3a1e8a-23cc-49e2-8f07-c4f40c1597af' })
  public readonly id_user: string;

  @ApiProperty({ type: String, format: 'uuid', example: '8d4ffda0-ed9f-4e15-8efe-cc6f2e8f27ec' })
  public readonly id_route_day_location: string;

  constructor(
    position_in_route: number,
    id_location: string,
    id_user: string,
    id_route_day_location: string,
  ) {
    this.position_in_route = position_in_route;
    this.id_location = id_location;
    this.id_user = id_user;
    this.id_route_day_location = id_route_day_location;
  }
}
