import { LocationDto } from '@/src/clients/application/dtos/location.dto';
import { isRecord } from "@/src/shared/application/guards/utils";

export const isLocationDto = (value: unknown): value is LocationDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_location === 'string' &&
    typeof value.street === 'string' &&
    typeof value.ext_number === 'string' &&
    typeof value.colony === 'string' &&
    typeof value.postal_code === 'string' &&
    (value.address_reference === null || value.address_reference === undefined || typeof value.address_reference === 'string') &&
    typeof value.location_name === 'string' &&
    typeof value.latitude === 'string' &&
    typeof value.longitude === 'string' &&
    typeof value.status_location === 'number' &&
    typeof value.id_creator === 'string' &&
    typeof value.id_client === 'string' &&
    typeof value.id_location_type === 'string' &&
    value.created_at instanceof Date &&
    value.updated_at instanceof Date
  );
};