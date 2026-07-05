import type { TransactionModel } from '@/src/sellings/application/models/transaction.model';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isTransactionModel = (value: unknown): value is TransactionModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_transaction === 'string' &&
    (value.cfdi === null || typeof value.cfdi === 'string') &&
    typeof value.state === 'number' &&
    typeof value.received_amount === 'number' &&
    (value.id_invoice_concept === null || typeof value.id_invoice_concept === 'string') &&
    (value.latitude === null || typeof value.latitude === 'string') &&
    (value.longitude === null || typeof value.longitude === 'string') &&
    value.created_at instanceof Date &&
    (value.id_location === null || typeof value.id_location === 'string') &&
    typeof value.id_client === 'string' &&
    typeof value.id_work_day === 'string' &&
    typeof value.created_by === 'string' &&
    typeof value.id_payment_method === 'string' &&
    typeof value.id_payment_schema === 'string'
  );
};
