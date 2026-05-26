import { ApiProperty } from '@nestjs/swagger';

import { RouteDayLocationProposalRequestDto } from '@/src/route-organization/application/dtos/route-day-location-proposal-request.dto';

export class CreateRouteDayProposalRequestDto {
  @ApiProperty({ type: String, example: 'Morning route optimization v1' })
  public readonly proposal_name: string;

  @ApiProperty({ type: String, example: 'c6d7e8f9-0123-4567-89ab-cdef01234567' })
  public readonly id_route_day: string;

  @ApiProperty({ type: RouteDayLocationProposalRequestDto, isArray: true })
  public readonly locations: RouteDayLocationProposalRequestDto[];

  constructor(
    proposal_name: string,
    id_route_day: string,
    locations: RouteDayLocationProposalRequestDto[],
  ) {
    this.proposal_name = proposal_name;
    this.id_route_day = id_route_day;
    this.locations = locations;
  }
}
