import { ApiProperty } from "@nestjs/swagger";


export class LocationTypeDto {
  @ApiProperty({ type: String, example: 'a188c43a-0397-474a-a3ce-b4ee041a1cc5' })
  public id_location_type: string;
  @ApiProperty({ type: String, example: 'Shop store' })
  public location_type_name: string;
  @ApiProperty({ type: Date, example: '2026-05-12 23:11:27.272537+00' })
  public created_at: Date;

  constructor (
    _id_location_type: string,
    _location_type_name: string,
    _created_at: Date,
  ) {
    this.id_location_type = _id_location_type
    this.location_type_name = _location_type_name
    this.created_at = _created_at
  }
}

