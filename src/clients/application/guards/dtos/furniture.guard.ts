import { FurnitureDto } from '@/src/clients/application/dtos/furniture.dto';
import { isRecord } from "@/src/shared/application/guards/utils";

export const isFurnitureDto = (value: unknown): value is FurnitureDto => {
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