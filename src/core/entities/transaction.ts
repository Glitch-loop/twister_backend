export class Transaction {
  constructor(
    public readonly id_transaction: string,
    public readonly state: number,
    public readonly amount: number,
    public readonly id_invoice_concept: string,
    public readonly created_at: Date,
    public readonly id_client: string,
    public readonly id_work_day: string,
    public readonly id_payment_method: string,
    public readonly id_payment_schema: string,
    public readonly cfdi?: string,
    public readonly id_location?: string,
  ) {}
}
