export interface TransactionModel {
  id_transaction: string;
  cfdi?: string;
  state: number;
  amount: number;
  id_invoice_concept: string;
  created_at: Date;
  id_location?: string;
  id_client: string;
  id_work_day: string;
  id_payment_method: string;
  id_payment_schema: string;
}
