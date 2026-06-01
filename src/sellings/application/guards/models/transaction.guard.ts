import type { TransactionModel } from '@/src/sellings/application/models/transaction.model';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isTransactionModel = (value: unknown): value is TransactionModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_transaction === 'string' &&
    (value.cfdi === undefined || typeof value.cfdi === 'string') &&
    typeof value.state === 'number' &&
    typeof value.received_amount === 'number' &&
    typeof value.id_invoice_concept === 'string' &&
    (value.latitude === undefined || typeof value.latitude === 'string') &&
    (value.longitude === undefined || typeof value.longitude === 'string') &&
    (value.id_location === undefined || typeof value.id_location === 'string') &&
    typeof value.id_client === 'string' &&
    typeof value.id_work_day === 'string' &&
    typeof value.id_payment_method === 'string' &&
    typeof value.id_payment_schema === 'string'
  );
};
