export interface WorkDayOperationHistoricModel {
  id_work_day_operation: string;
  id_operation_type: string;
  created_at: string;
  id_work_day: string;
  id_route_day: string;
  latitude: string | null;
  longitude: string | null;
  id_route_transaction: string | null;
  id_inventory_operation: string | null;
  id_location: string | null;
  id_day_operation_dependent: string | null;
}
