import { ApiProperty } from '@nestjs/swagger';
import { RouteDayLocationDto } from "@/src/route-organization/application/dtos/route-day-location.dto";

export class RouteDayDto {
  @ApiProperty({ type: String, format: 'uuid', example: 'c6d7e8f9-0123-4567-89ab-cdef01234567' })
  public readonly id_route_day: string;

  @ApiProperty({ type: String, format: 'uuid', example: '4a7ce6fa-f96f-4e3f-b3d5-1f7bcb4f4f8f' })
  public readonly id_route: string;

  @ApiProperty({ type: String, example: 'monday' })
  public readonly id_day: string;

  @ApiProperty({ type: [RouteDayLocationDto] })
  public readonly locations: RouteDayLocationDto[];

  constructor(
    id_route_day: string,
    id_route: string,
    id_day: string,
    locations: RouteDayLocationDto[],
  ) {
    this.id_route_day = id_route_day;
    this.id_route = id_route;
    this.id_day = id_day;
    this.locations = locations;
  }
}
