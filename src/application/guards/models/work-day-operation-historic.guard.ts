import type { WorkDayOperationHistoricModel } from '@/src/application/models/work-day-operation-historic.model';

import { isRecord } from '@/src/shared/guards/utils';

export const isWorkDayOperationHistoricModel = (value: unknown): value is WorkDayOperationHistoricModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_work_day_operation === 'string' &&
    (value.id_client === undefined || typeof value.id_client === 'string') &&
    (value.id_route_transaction === undefined || typeof value.id_route_transaction === 'string') &&
    (value.id_route === undefined || typeof value.id_route === 'string') &&
    typeof value.id_operation_type === 'string' &&
    value.created_at instanceof Date &&
    (value.id_day_operation_dependent === undefined || typeof value.id_day_operation_dependent === 'string') &&
    typeof value.id_work_day === 'string'
  );
};
