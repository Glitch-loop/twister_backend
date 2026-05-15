// Models
import type { LocationTypeModel } from '@/src/clients/application/models/location-type.model';

// Guards
import { isRecord } from '@/src/shared/guards/utils';

export const isLocationTypeModel = (value: unknown): value is LocationTypeModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_location_type === 'string' &&
    typeof value.location_type_name === 'string' &&
    value.created_at instanceof Date
  );
};
