import { ApiProperty } from "@nestjs/swagger";

export class ClientRequestDto {
  @ApiProperty({ type: String, example: 'Shop store' })
  public location_type_name: string;
  @ApiProperty({ type: String, example: 'a188c43a-0397-474a-a3ce-b4ee041a1cc5' })
  public id_client: string;
  @ApiProperty({ type: String, example: 'Jhon Doe' })
  public legal_name: string;
  @ApiProperty({ type: String, example: '48327' })
  public postal_code: string;
  @ApiProperty({ type: String, example: 'Persona fisica' })
  public fiscal_regime: string;
  @ApiProperty({ type: String, example: 'Jhon Doe' })
  public name: string;
  @ApiProperty({ type: String, example: '3378941234' })
  public cellphone: string;
  @ApiProperty({ type: String, example: 'jhondoe@gmail.com' })
  public email: string;
  constructor (
    private readonly _location_type_name: string,
    private readonly _id_client: string,
    private readonly _legal_name: string,
    private readonly _postal_code: string,
    private readonly _fiscal_rgime: string,
    private readonly _name: string,
    private readonly _cellphone: string,
    private readonly _email: string,
  ) {
    this.location_type_name = _location_type_name;
    this.id_client = _id_client;
    this.legal_name = _legal_name;
    this.postal_code = _postal_code;
    this.fiscal_regime = _fiscal_rgime;
    this.name = _name;
    this.cellphone = _cellphone;
    this.email = _email;
  }
}
