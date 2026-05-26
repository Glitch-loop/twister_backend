import { ApiProperty } from '@nestjs/swagger';

export class RouteDayLocationProposalDto {
  @ApiProperty({ type: String, example: '0f8183df-3b17-4fbf-bf28-c0bf260ee4e1' })
  public readonly id_route_day_location_proposal: string;

  @ApiProperty({ type: Number, example: 1 })
  public readonly position_in_route: number;

  @ApiProperty({ type: String, example: 'f4c9b6fd-3d5a-4f4f-9c5a-5f2c0e2ebc41' })
  public readonly id_location: string;

  constructor(
    id_route_day_location_proposal: string,
    position_in_route: number,
    id_location: string,
  ) {
    this.id_route_day_location_proposal = id_route_day_location_proposal;
    this.position_in_route = position_in_route;
    this.id_location = id_location;
  }
}
