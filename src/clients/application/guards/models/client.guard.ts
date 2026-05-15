import type { ClientModel } from '@/src/application/models/client.model';

import { isRecord } from '@/src/application/guards/utils';

export const isClientModel = (value: unknown): value is ClientModel => {
  if (!isRecord(value)) {
    return false;
  }
  
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
