import type { TransactionModel } from '@/src/application/models/transaction.model';

import { isRecord } from '@/src/application/guards/utils';

export const isTransactionModel = (value: unknown): value is TransactionModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_transaction === 'string' &&
    (value.cfdi === undefined || typeof value.cfdi === 'string') &&
    typeof value.state === 'number' &&
    typeof value.amount === 'number' &&
    typeof value.id_invoice_concept === 'string' &&
    value.created_at instanceof Date &&
    (value.id_location === undefined || typeof value.id_location === 'string') &&
    typeof value.id_client === 'string' &&
    typeof value.id_work_day === 'string' &&
    typeof value.id_payment_method === 'string' &&
    typeof value.id_payment_schema === 'string'
  );
};
