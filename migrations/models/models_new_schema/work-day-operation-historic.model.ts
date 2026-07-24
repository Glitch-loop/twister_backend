export class WorkDayOperationHistoricModel {
  constructor(
    public readonly id_operation_type: string,
    public readonly created_at: string,
    public readonly id_work_day: string,
    public readonly id_route_day: string,
    public readonly latitude: string | null,
    public readonly longitude: string | null,
    public readonly id_route_transaction: string | null,
    public readonly id_inventory_operation: string | null,
    public readonly id_location: string | null,
    public readonly id_day_operation_dependent: string | null,
    public readonly id_work_day_operation: string | undefined
  ) { }
}
