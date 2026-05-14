export class TransactionLocationObjectValue {
  constructor(
    public readonly id_invoice_concept: string,
    public readonly id_transaction: string,
    public readonly created_at: Date,
    public readonly longitude?: string,
    public readonly latitude?: string,
  ) {}
}
