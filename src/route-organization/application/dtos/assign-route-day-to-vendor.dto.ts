import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignRouteDayToVendorDto {
  @ApiPropertyOptional({ type: String, format: 'uuid', example: '53dc3ca4-f9db-4c22-86b6-8f71fc562dc5' })
  public readonly id_assigned_route_day?: string;

  @ApiProperty({ type: String, format: 'uuid', example: 'c6d7e8f9-0123-4567-89ab-cdef01234567' })
  public readonly id_route_day: string;

  @ApiProperty({ type: String, format: 'uuid', example: '9f3a1e8a-23cc-49e2-8f07-c4f40c1597af' })
  public readonly id_user: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2026-05-30T17:00:00.000Z',
  })
  public readonly expired_at?: Date;

  constructor(
    id_route_day: string,
    id_user: string,
    id_assigned_route_day?: string,
    expired_at?: Date,
  ) {
    this.id_assigned_route_day = id_assigned_route_day;
    this.id_route_day = id_route_day;
    this.id_user = id_user;
    this.expired_at = expired_at;
  }
}