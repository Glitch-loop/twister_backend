import { ApiProperty } from "@nestjs/swagger";

export class ClientDto {
  @ApiProperty({ type: String, example: 'a188c43a-0397-474a-a3ce-b4ee041a1cc5' })
  public readonly id_client: string;
  @ApiProperty({ type: String, example: 'Jhon Doe' })
  public readonly legal_name: string;
  @ApiProperty({ type: String, example: '48327' })
  public readonly postal_code: string;
  @ApiProperty({ type: String, example: 'Persona fisica' })
  public readonly fiscal_regime: string;
  @ApiProperty({ type: String, example: 'Jhon Doe' })
  public readonly name: string;
  @ApiProperty({ type: String, example: '3378941234' })
  public readonly cellphone: string;
  @ApiProperty({ type: String, example: 'jhondoe@gmail.com' })
  public readonly email: string;
  @ApiProperty({ type: String, example: '2026-05-22 17:20:42.136+00' })
  created_at: Date;
  @ApiProperty({ type: String, example: '2026-05-22 17:20:42.136+00' })
  updated_at: Date;
  constructor (
    _id_client: string,
    _legal_name: string,
    _postal_code: string,
    _fiscal_rgime: string,
    _name: string,
    _cellphone: string,
    _email: string,
    _created_at: Date,
    _updated_at: Date,
  ) {
    this.id_client = _id_client;
    this.legal_name = _legal_name;
    this.postal_code = _postal_code;
    this.fiscal_regime = _fiscal_rgime;
    this.name = _name;
    this.cellphone = _cellphone;
    this.email = _email;
    this.created_at = _created_at;
    this.updated_at = _updated_at;
  }
}
