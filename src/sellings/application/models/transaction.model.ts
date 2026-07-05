export interface TransactionModel {
  id_transaction: string;
  cfdi: string | null;
  state: number;
  received_amount: number;
  id_invoice_concept: string | null;
  created_at: Date;
  latitude: string | null;
  longitude: string | null;
  id_location: string | null;
  id_client: string;
  created_by: string;
  id_work_day: string;
  id_payment_method: string;
  id_payment_schema: string;
}
