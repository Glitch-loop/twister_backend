import type { TaxClientInformationEntity } from '@/src/clients/core/entities/tax-client-information.entity';
import { isRecord } from '@/src/shared/guards/utils';

export const isTaxClientInformationEntity = (value: unknown): value is TaxClientInformationEntity => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id_client === 'string' &&
    typeof value.legal_name === 'string' &&
    typeof value.postal_code === 'string' &&
    typeof value.fiscal_regime === 'string' &&
    typeof value.name === 'string' &&
    typeof value.cellphone === 'string' &&
    typeof value.email === 'string' &&
    value.created_at instanceof Date &&
    value.updated_at instanceof Date
  );
};
