export class TaxInTransactionObjectValue {
  constructor(
    public readonly id_tax_in_transaction: string,
    public readonly id_transaction: string,
    public readonly id_tax: string,
    public readonly tax_rate_at_moment_of_transaction: number,
    public readonly created_at: Date,
  ) {}
}
