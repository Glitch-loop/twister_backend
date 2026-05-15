// Entities
import type { FurnitureEntity } from '@/src/clients/core/entities/furniture.entity';

// Gurads
import { isRecord } from '@/src/shared/guards/utils';

export const isFurnitureEntity = (value: unknown): value is FurnitureEntity => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id_furniture === 'string' &&
    value.delivered_date instanceof Date &&
    typeof value.description_furniture === 'string' &&
    typeof value.id_location === 'string'
  );
};
