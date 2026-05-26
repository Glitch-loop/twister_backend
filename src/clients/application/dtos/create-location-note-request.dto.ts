import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationNoteRequestDto {
  @ApiProperty({ type: String, example: 'Main gate key is with manager on duty.' })
  public note: string;

  constructor(
    private readonly _note: string,
  ) {
    this.note = _note;
  }
}
