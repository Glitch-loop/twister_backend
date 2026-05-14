import type { LocationTypeModel } from '../../models/location-type.model';

import { isRecord } from '../utils';

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
