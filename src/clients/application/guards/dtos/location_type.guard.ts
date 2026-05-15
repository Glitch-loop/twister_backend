import { LocationTypeDto } from '@/src/clients/application/dtos/location_type.dto';
import { isRecord } from "@/src/shared/guards/utils";

export const isLocationTypeDto = (value: unknown): value is LocationTypeDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_location_type === 'string' &&
    typeof value.location_type_name === 'string' &&
    value.created_at instanceof Date
  );
};