import { DAY_OPERATIONS_ENUM } from "@/src/business-operation-route/core/enums/day-operations.enum";

export class WorkDayOperationHistoricEntity {
  constructor(
    public readonly id_work_day_operation: string,
    public readonly id_operation_type: DAY_OPERATIONS_ENUM,
    public readonly created_at: Date,
    public readonly id_work_day: string,
    public readonly id_client?: string,
    public readonly id_route_transaction?: string,
    public readonly id_route?: string,
    public readonly id_day_operation_dependent?: string,
  ) {}
}
