// Entities
import type { FurnitureEntity } from '@/src/clients/core/entities/furniture.entity';

// Gurads
import { isRecord } from '@/src/shared/application/guards/utils';

export const isFurnitureEntity = (value: unknown): value is FurnitureEntity => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id_furniture === 'string' &&
    typeof value.description_furniture === 'string' &&
    typeof value.id_location === 'string'
  );
};
