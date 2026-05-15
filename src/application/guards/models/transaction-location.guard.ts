import type { TransactionLocationModel } from '@/src/application/models/transaction-location.model';

import { isRecord } from '@/src/shared/guards/utils';

export const isTransactionLocationModel = (value: unknown): value is TransactionLocationModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_invoice_concept === 'string' &&
    typeof value.id_transaction === 'string' &&
    value.created_at instanceof Date &&
    (value.longitude === undefined || typeof value.longitude === 'string') &&
    (value.latitude === undefined || typeof value.latitude === 'string')
  );
};
