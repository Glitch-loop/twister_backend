import { WorkDayOperationHistoricEntity } from "@/src/business-operation-route/core/entities/work-day-operation-historic.entity";
import { WorkDayEntity } from "@/src/business-operation-route/core/entities/work-day.entity";
import { NoteObjectValue } from "@/src/business-operation-route/core/value-objects/note.object-value";
import { DAY_OPERATIONS_ENUM } from "@/src/business-operation-route/core/enums/day-operations.enum";

export abstract class WorkDayRepository {
  abstract insertWorkDay(work_day: WorkDayEntity): Promise<void>;
  abstract insertWorkDayNote(id_work_day: string, work_day: NoteObjectValue): Promise<void>;
  abstract updateWorkDayEntity(work_day: WorkDayEntity): Promise<void>;
  abstract insertWorkDayHistoric(work_day_operations_historic: WorkDayOperationHistoricEntity[]): Promise<void>;
  abstract listWorkDays(
    limit: number,
    start_date_start_work_day?: Date,
    end_date_end_work_day?: Date|null,
    final_pretty_cash?: number,
    id_route_day?: string[],
    id_vendor?: string[],
    id_pay_stub?: string[],
    nextCreatedAt?: string, 
    nextId?: string,
  ): Promise<WorkDayEntity[]>;
  abstract listWorkDaysHistoric(
    limit: number,
    start_date_created_at?: Date,
    end_date_created_at?: Date,
    id_location?: string[],
    id_route_transaction?: string[],
    id_route_day?: string[],
    operation_type?: DAY_OPERATIONS_ENUM[],
    id_work_day?: string[],
    nextCreatedAt?: string, 
    nextId?: string,
  ): Promise<WorkDayOperationHistoricEntity[]>;
  abstract retrieveWorkDayByWorkDayId(work_day_id: string[]): Promise<WorkDayEntity[]>;
  abstract retrieveWorkDayOperationsHistoricByWorkDayId(work_day_id: string[]): Promise<WorkDayOperationHistoricEntity[]>;
  abstract retrieveWorkDayOperationsHistoricByWorkDayOperationId(work_day_operation_id: string[]): Promise<WorkDayOperationHistoricEntity[]>;
}