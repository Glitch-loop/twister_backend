import type { WorkDayOperationHistoricEntity } from '@/src/business-operation-route/core/entities/work-day-operation-historic.entity';
import { isRecord } from '@/src/shared/application/guards/utils';
import { DAY_OPERATIONS_ENUM } from '@/src/business-operation-route/core/enums/day-operations.enum';

export const isWorkDayOperationHistoricEntity = (value: unknown): value is WorkDayOperationHistoricEntity => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id_work_day_operation === 'string' &&
    typeof value.id_operation_type === 'string' &&
    Object.values(DAY_OPERATIONS_ENUM).includes(value.id_operation_type as DAY_OPERATIONS_ENUM) &&
    typeof value.id_work_day === 'string' &&
    (value.id_client === undefined || typeof value.id_client === 'string') &&
    (value.id_route_transaction === undefined || typeof value.id_route_transaction === 'string') &&
    (value.id_route_day === undefined || typeof value.id_route_day === 'string') &&
    (value.id_day_operation_dependent === undefined || typeof value.id_day_operation_dependent === 'string')
  );
};
