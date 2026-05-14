import type { TaxModel } from '../../models/tax.model';

import { isRecord } from '../utils';

export const isTaxModel = (value: unknown): value is TaxModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_tax === 'string' &&
    typeof value.tax_name === 'string' &&
    typeof value.tax_rate === 'string' &&
    typeof value.id_transaction === 'string' &&
    value.created_at instanceof Date
  );
};
