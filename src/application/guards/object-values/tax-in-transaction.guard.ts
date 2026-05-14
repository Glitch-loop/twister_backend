import type { TaxInTransactionObjectValue } from '@/src/core/object-values/tax-in-transaction.object-value';
import { isRecord } from '@/src/application/guards/utils';

export const isTaxInTransactionObjectValue = (value: unknown): value is TaxInTransactionObjectValue => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_tax_in_transaction === 'string' &&
    typeof value.id_transaction === 'string' &&
    typeof value.id_tax === 'string' &&
    typeof value.tax_rate_at_moment_of_transaction === 'number' &&
    value.created_at instanceof Date
  );
};