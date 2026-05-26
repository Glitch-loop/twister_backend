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

export class RouteDayProposalDto {
  @ApiProperty({ type: String, example: '53dc3ca4-f9db-4c22-86b6-8f71fc562dc5' })
  public readonly id_route_day_proposal: string;

  @ApiProperty({ type: String, example: 'Morning route optimization v1' })
  public readonly proposal_name: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-05-25T12:30:00.000Z',
  })
  public readonly created_at: Date;

  @ApiProperty({ type: String, example: 'c6d7e8f9-0123-4567-89ab-cdef01234567' })
  public readonly id_route_day: string;

  @ApiProperty({ type: RouteDayLocationProposalDto, isArray: true })
  public readonly locations: RouteDayLocationProposalDto[];

  constructor(
    id_route_day_proposal: string,
    proposal_name: string,
    created_at: Date,
    id_route_day: string,
    locations: RouteDayLocationProposalDto[],
  ) {
    this.id_route_day_proposal = id_route_day_proposal;
    this.proposal_name = proposal_name;
    this.created_at = created_at;
    this.id_route_day = id_route_day;
    this.locations = locations;
  }
}
