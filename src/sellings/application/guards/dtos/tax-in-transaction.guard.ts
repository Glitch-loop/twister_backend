import type { TaxInTransactionDto } from '@/src/sellings/application/dtos/tax-in-transaction.dto';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isTaxInTransactionDto = (value: unknown): value is TaxInTransactionDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_tax_in_transaction === 'string' &&
    typeof value.id_transaction === 'string' &&
    typeof value.id_tax === 'string' &&
    typeof value.tax_rate_at_moment_of_transaction === 'number'
  );
};
