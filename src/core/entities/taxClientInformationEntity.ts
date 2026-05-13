export class TaxClientInformationEntity {
  constructor(
    public readonly id_client: string,
    public readonly legal_name: string,
    public readonly postal_code: string,
    public readonly fiscal_regime: string,
    public readonly name: string,
    public readonly cellphone: string,
    public readonly email: string,
    public readonly created_at: Date,
    public readonly updated_at: Date,
  ) {}
}
