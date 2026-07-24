export class TransactionsModel {
  constructor(
    public readonly id_transaction: string,
    public readonly cfdi: string | null,
    public readonly state: number,
    public readonly received_amount: number,
    public readonly id_invoice_concept: string | null,
    public readonly created_at: string,
    public readonly id_location: string | null,
    public readonly id_client: string,
    public readonly id_work_day: string,
    public readonly id_payment_method: string,
    public readonly id_payment_schema: string,
    public readonly latitude: string | null,
    public readonly longitude: string | null,
    public readonly created_by: string | null,
  ) {}
}
