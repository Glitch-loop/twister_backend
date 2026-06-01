import type { TransactionLocationObjectValue } from '@/src/core/object-values/transaction-location.object-value';
import { isRecord } from '@/src/shared/application/guards/utils';

export const isTransactionLocationObjectValue = (value: unknown): value is TransactionLocationObjectValue => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_invoice_concept === 'string' &&
    typeof value.id_transaction === 'string' &&
    value.created_at instanceof Date
  );
};