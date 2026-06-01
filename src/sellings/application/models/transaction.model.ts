export interface TransactionModel {
  id_transaction: string;
  cfdi?: string;
  state: number;
  received_amount: number;
  id_invoice_concept: string;
  created_at: Date;
  latitude?: string;
  longitude?: string;
  id_location?: string,
  id_client: string;
  id_work_day: string;
  id_payment_method: string;
  id_payment_schema: string;
}
