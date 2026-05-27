import { WorkDayOperationHistoricEntity } from "@/src/business-operation-route/core/entities/work-day-operation-historic.entity";
import { WorkDayEntity } from "@/src/business-operation-route/core/entities/work-day.entity";
import { NoteObjectValue } from "@/src/business-operation-route/core/value-objects/note.object-value";

export abstract class WorkDayRepository {
  abstract insertWorkDay(work_day: WorkDayEntity): Promise<void>;
  abstract insertWorkDayNote(id_work_day: string, work_day: NoteObjectValue): Promise<void>;
  abstract updateWorkDayEntity(work_day: WorkDayEntity): Promise<void>;
  abstract insertWorkDayHistoric(work_day_operations_hisotic: WorkDayOperationHistoricEntity[]): Promise<void>;
}