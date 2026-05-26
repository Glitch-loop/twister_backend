import { ApiProperty } from '@nestjs/swagger';

export class RouteDayLocationProposalRequestDto {
  @ApiProperty({ type: Number, example: 1 })
  public readonly position_in_route: number;

  @ApiProperty({ type: String, example: 'f4c9b6fd-3d5a-4f4f-9c5a-5f2c0e2ebc41' })
  public readonly id_location: string;

  constructor(position_in_route: number, id_location: string) {
    this.position_in_route = position_in_route;
    this.id_location = id_location;
  }
}
