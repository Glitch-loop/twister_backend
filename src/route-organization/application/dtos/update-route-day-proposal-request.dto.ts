import { ApiPropertyOptional } from '@nestjs/swagger';

import { RouteDayLocationProposalRequestDto } from '@/src/route-organization/application/dtos/route-day-location-proposal-request.dto';

export class UpdateRouteDayProposalRequestDto {
  @ApiPropertyOptional({ type: String, example: 'Morning route optimization v2' })
  public readonly proposal_name?: string;

  @ApiPropertyOptional({ type: RouteDayLocationProposalRequestDto, isArray: true })
  public readonly locations?: RouteDayLocationProposalRequestDto[];

  constructor(
    proposal_name?: string,
    locations?: RouteDayLocationProposalRequestDto[],
  ) {
    this.proposal_name = proposal_name;
    this.locations = locations;
  }
}
