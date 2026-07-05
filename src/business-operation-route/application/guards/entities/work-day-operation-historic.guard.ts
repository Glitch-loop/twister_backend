// Enums
import { DAY_OPERATIONS_ENUM } from '@/src/business-operation-route/core/enums/day-operations.enum';

// Entities
import type { WorkDayOperationHistoricEntity } from '@/src/business-operation-route/core/entities/work-day-operation-historic.entity';

// Records
import { isRecord } from '@/src/shared/application/guards/utils';

export const isWorkDayOperationHistoricEntity = (value: unknown): value is WorkDayOperationHistoricEntity => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id_work_day_operation === 'string' &&
    typeof value.id_operation_type === 'string' && Object.values(DAY_OPERATIONS_ENUM).includes(value.id_operation_type as DAY_OPERATIONS_ENUM) &&
    typeof value.id_work_day === 'string' &&
    (value.latitude === null || typeof value.latitude === 'string') &&
    (value.longitude === null || typeof value.longitude === 'string') &&
    (value.id_location === null || typeof value.id_location === 'string') &&
    (value.id_route_transaction === null || typeof value.id_route_transaction === 'string') &&
    (value.id_inventory_operation === null || typeof value.id_inventory_operation === 'string') &&
    typeof value.id_route_day === 'string' &&
    (value.id_day_operation_dependent === null || typeof value.id_day_operation_dependent === 'string')
  );
};
