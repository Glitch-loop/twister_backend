import type { TaxEntity } from '@/src/core/entities/tax.entity';
import { isRecord } from '@/src/application/guards/utils';

export const isTaxEntity = (value: unknown): value is TaxEntity => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id_tax === 'string' &&
    typeof value.tax_name === 'string' &&
    typeof value.tax_rate === 'string' &&
    typeof value.id_transaction === 'string' &&
    value.created_at instanceof Date
  );
};
