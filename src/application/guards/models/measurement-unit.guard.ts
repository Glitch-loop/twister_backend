import type { MeasurementUnitModel } from '../../models/measurement-unit.model';

import { isRecord } from '../utils';

export const isMeasurementUnitModel = (value: unknown): value is MeasurementUnitModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_measurement_unit === 'string' &&
    typeof value.measurement_unit_name === 'string'
  );
};
