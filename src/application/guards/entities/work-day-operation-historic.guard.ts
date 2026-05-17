import type { WorkDayOperationHistoricEntity } from '@/src/core/entities/work-day-operation-historic.entity';
import { isRecord } from '@/src/shared/application/guards/utils';

export const isWorkDayOperationHistoricEntity = (value: unknown): value is WorkDayOperationHistoricEntity => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id_work_day_operation === 'string' &&
    typeof value.id_operation_type === 'string' &&
    value.created_at instanceof Date &&
    typeof value.id_work_day === 'string' &&
    (value.id_client === undefined || typeof value.id_client === 'string') &&
    (value.id_route_transaction === undefined || typeof value.id_route_transaction === 'string') &&
    (value.id_route === undefined || typeof value.id_route === 'string') &&
    (value.id_day_operation_dependent === undefined || typeof value.id_day_operation_dependent === 'string')
  );
};
