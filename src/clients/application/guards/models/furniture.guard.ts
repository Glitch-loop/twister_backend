import type { FurnitureModel } from '@/src/application/models/furniture.model';

import { isRecord } from '@/src/shared/guards/utils';

export const isFurnitureModel = (value: unknown): value is FurnitureModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_furniture === 'string' &&
    value.delivered_date instanceof Date &&
    typeof value.description_furniture === 'string' &&
    typeof value.id_location === 'string'
  );
};
