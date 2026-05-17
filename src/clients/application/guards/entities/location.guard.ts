// Entities
import type { LocationEntity } from '@/src/clients/core/entities/location.entity';

// Guards
import { isRecord } from '@/src/shared/application/guards/utils';

export const isLocationEntity = (value: unknown): value is LocationEntity => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id_location === 'string' &&
    typeof value.street === 'string' &&
    typeof value.ext_number === 'string' &&
    typeof value.colony === 'string' &&
    typeof value.postal_code === 'string' &&
    typeof value.location_name === 'string' &&
    typeof value.latitude === 'string' &&
    typeof value.longitude === 'string' &&
    typeof value.status_location !== 'undefined' &&
    typeof value.id_creator === 'string' &&
    typeof value.id_client === 'string' &&
    typeof value.location_type !== 'undefined' &&
    Array.isArray(value.notes) &&
    (typeof value.address_reference === 'string' || value.address_reference === null)
  );
};
