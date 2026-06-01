import type { TaxModel } from '@/src/sellings/application/models/tax.model';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isTaxModel = (value: unknown): value is TaxModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_tax === 'string' &&
    typeof value.tax_name === 'string' &&
    typeof value.tax_rate === 'string'
  );
};
