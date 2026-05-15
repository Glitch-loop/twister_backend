// Models
import type { LocationModel } from '@/src/application/models/location.model';

// Guards
import { isRecord } from '@/src/shared/guards/utils';

export const isLocationModel = (value: unknown): value is LocationModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_location === 'string' &&
    typeof value.street === 'string' &&
    typeof value.ext_number === 'string' &&
    typeof value.colony === 'string' &&
    typeof value.postal_code === 'string' &&
    (value.address_reference === undefined || typeof value.address_reference === 'string') &&
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
