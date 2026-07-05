import type { WorkDayOperationHistoricModel } from '@/src/business-operation-route/application/models/work-day-operation-historic.model';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isWorkDayOperationHistoricModel = (value: unknown): value is WorkDayOperationHistoricModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_work_day_operation === 'string' &&
    typeof value.id_operation_type === 'string' &&
    typeof value.created_at === 'string' &&
    typeof value.id_work_day === 'string' &&
    typeof value.id_route_day === 'string' &&
    (value.latitude === null || typeof value.latitude === 'string') &&
    (value.longitude === null || typeof value.longitude === 'string') &&
    (value.id_route_transaction === null || typeof value.id_route_transaction === 'string') &&
    (value.id_inventory_operation === null || typeof value.id_inventory_operation === 'string') &&
    (value.id_location === null || typeof value.id_location === 'string') &&
    (value.id_day_operation_dependent === null || typeof value.id_day_operation_dependent === 'string')
  );
};
