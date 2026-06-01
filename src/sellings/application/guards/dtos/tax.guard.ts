import type { TaxDto } from '@/src/sellings/application/dtos/tax.dto';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isTaxDto = (value: unknown): value is TaxDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_tax === 'string' &&
    typeof value.tax_name === 'string' &&
    typeof value.tax_rate === 'string'
  );
};
