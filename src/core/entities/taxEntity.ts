export class TaxEntity {
  constructor(
    public readonly id_tax: string,
    public readonly tax_name: string,
    public readonly tax_rate: string,
    public readonly id_transaction: string,
    public readonly created_at: Date,
  ) {}
}
