import { ApiProperty } from "@nestjs/swagger";

export class LocationTypeRequestDto {
  @ApiProperty({ type: String, example: 'Shop store' })
  public location_type_name: string;
  constructor (
    private readonly _location_type_name: string,
  ) {
    this.location_type_name = _location_type_name
  }
}