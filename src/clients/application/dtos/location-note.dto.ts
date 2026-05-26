import { ApiProperty } from '@nestjs/swagger';

export class LocationNoteDto {
  @ApiProperty({ type: String, example: '3f2e1c43-2fd1-4d6f-a47b-c8ab36b93731' })
  public id_location_note: string;

  @ApiProperty({ type: String, example: 'Main gate key is with manager on duty.' })
  public note: string;

  @ApiProperty({ type: String, example: 'f4c9b6fd-3d5a-4f4f-9c5a-5f2c0e2ebc41' })
  public id_location: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-05-12T23:11:27.272Z',
  })
  public created_at: Date;

  constructor(
    private readonly _id_location_note: string,
    private readonly _note: string,
    private readonly _id_location: string,
    private readonly _created_at: Date,
  ) {
    this.id_location_note = _id_location_note;
    this.note = _note;
    this.id_location = _id_location;
    this.created_at = _created_at;
  }
}
