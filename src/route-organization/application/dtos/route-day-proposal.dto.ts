import { ApiProperty } from '@nestjs/swagger';

import { RouteDayLocationProposalDto } from '@/src/route-organization/application/dtos/route-day-location-proposal.dto';

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
