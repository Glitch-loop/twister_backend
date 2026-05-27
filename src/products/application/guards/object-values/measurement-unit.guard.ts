import type { MeasurementUnitObjectValue } from '@/src/products/core/value-objects/measurement-unit.object-value';
import { isRecord } from '@/src/shared/application/guards/utils';

export const isMeasurementUnitObjectValue = (value: unknown): value is MeasurementUnitObjectValue => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_measurement_unit === 'string' &&
    typeof value.measurement_unit_name === 'string'
  );
};