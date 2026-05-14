import type { LocationTypeObjectValue } from '@/src/core/object-values/location-type.object-value';
import { isRecord } from '@/src/application/guards/utils';

export const isLocationTypeObjectValue = (value: unknown): value is LocationTypeObjectValue => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_location_type === 'string' &&
    typeof value.location_type_name === 'string' &&
    value.created_at instanceof Date
  );
};