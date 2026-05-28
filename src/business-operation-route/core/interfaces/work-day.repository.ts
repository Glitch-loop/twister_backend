import { WorkDayOperationHistoricEntity } from "@/src/business-operation-route/core/entities/work-day-operation-historic.entity";
import { WorkDayEntity } from "@/src/business-operation-route/core/entities/work-day.entity";
import { NoteObjectValue } from "@/src/business-operation-route/core/value-objects/note.object-value";

export abstract class WorkDayRepository {
  abstract insertWorkDay(work_day: WorkDayEntity): Promise<void>;
  abstract insertWorkDayNote(id_work_day: string, work_day: NoteObjectValue): Promise<void>;
  abstract updateWorkDayEntity(work_day: WorkDayEntity): Promise<void>;
  abstract insertWorkDayHistoric(work_day_operations_hisotic: WorkDayOperationHistoricEntity[]): Promise<void>;
  abstract listWorkDays(
    start_date: Date,
    end_date: Date,
    final_pretty_cash: number,
    id_route_day: string[],
    id_vendor: string[],
    id_pay_stub: string[],
  ): Promise<void>;
  abstract listWorkDaysHistoric(
    start_date: Date,
    end_date: Date,
    final_pretty_cash: number,
    id_location: string[],
    id_route_transaction: string[],
    id_route: string[]
  ): Promise<void>;
  abstract retrieveWorkDayByWorkDayId(work_day_operations_hisotic: WorkDayOperationHistoricEntity): Promise<void>;
  abstract retrieveWorkDayOperationsHistoricByWorkDayId(work_day_operations_hisotic: WorkDayOperationHistoricEntity): Promise<void>;
}