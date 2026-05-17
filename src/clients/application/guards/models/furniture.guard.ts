// Models
import type { FurnitureModel } from '@/src/clients/application/models/furniture.model';

// Guards
import { isRecord } from '@/src/shared/application/guards/utils';

export const isFurnitureModel = (value: unknown): value is FurnitureModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_furniture === 'string' &&
    typeof value.description_furniture === 'string' &&
    typeof value.id_location === 'string'
  );
};
