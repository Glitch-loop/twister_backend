import type { WorkDayOperationHistoricModel } from '@/src/business-operation-route/application/models/work-day-operation-historic.model';
import { DAY_OPERATIONS_ENUM } from '@/src/business-operation-route/core/enums/day-operations.enum';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isWorkDayOperationHistoricModel = (value: unknown): value is WorkDayOperationHistoricModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_work_day_operation === 'string' &&
    (value.id_client === null || typeof value.id_client === 'string') &&
    (value.id_route_transaction === null || typeof value.id_route_transaction === 'string') &&
    (value.id_inventory_operation === null || typeof value.id_inventory_operation === 'string') &&
    (value.id_route_day === null || typeof value.id_route_day === 'string') &&
    typeof value.latitude === 'string' &&
    typeof value.longitude === 'string' &&
    typeof value.id_operation_type === 'string' &&
    Object.values(DAY_OPERATIONS_ENUM).includes(value.id_operation_type as DAY_OPERATIONS_ENUM) &&
    (value.id_day_operation_dependent === undefined || value.id_day_operation_dependent === null || typeof value.id_day_operation_dependent === 'string') &&
    typeof value.id_work_day === 'string'
  );
};
