export interface TaxInTransactionModel {
  id_tax_in_transaction: string;
  id_transaction: string;
  id_tax: string;
  tax_rate_at_moment_of_transaction: number;
  created_at: Date;
}
