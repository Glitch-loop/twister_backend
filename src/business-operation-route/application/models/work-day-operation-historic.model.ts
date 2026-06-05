import { DAY_OPERATIONS_ENUM } from '@/src/business-operation-route/core/enums/day-operations.enum';

export interface WorkDayOperationHistoricModel {
  id_work_day_operation: string;
  id_work_day: string;
  id_operation_type: DAY_OPERATIONS_ENUM;
  created_at: Date;
  id_location: string|null;
  id_route_transaction: string|null;
  id_inventory_operation: string|null;
  id_route_day: string;
  latitude: string;
  longitude: string;
  id_day_operation_dependent: string|null;
}
