export interface WorkDayOperationHistoricModel {
  id_work_day_operation: string;
  id_client?: string;
  id_route_transaction?: string;
  id_route?: string;
  id_operation_type: string;
  created_at: Date;
  id_day_operation_dependent?: string;
  id_work_day: string;
}
