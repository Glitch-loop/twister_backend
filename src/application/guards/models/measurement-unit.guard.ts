import type { MeasurementUnitModel } from '@/src/application/models/measurement-unit.model';

import { isRecord } from '@/src/shared/guards/utils';

export const isMeasurementUnitModel = (value: unknown): value is MeasurementUnitModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_measurement_unit === 'string' &&
    typeof value.measurement_unit_name === 'string'
  );
};
