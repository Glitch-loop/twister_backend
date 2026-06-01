import type { TransactionLocationObjectValue } from '@/src/sellings/core/value-objects/transaction-location.object-value';
import { isRecord } from '@/src/shared/application/guards/utils';

export const isTransactionLocationObjectValue = (value: unknown): value is TransactionLocationObjectValue => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_invoice_concept === 'string' &&
    typeof value.id_transaction === 'string' &&
    (value.longitude === undefined || typeof value.longitude === 'string') &&
    (value.latitude === undefined || typeof value.latitude === 'string')
  );
};