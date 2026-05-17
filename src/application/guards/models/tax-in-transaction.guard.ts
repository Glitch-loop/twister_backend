import type { TaxInTransactionModel } from '@/src/application/models/tax-in-transaction.model';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isTaxInTransactionModel = (value: unknown): value is TaxInTransactionModel => {
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
