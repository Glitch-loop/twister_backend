import { NoteObjectValue } from "@/src/business-operation-route/core/value-objects/note.object-value";

export class WorkDayEntity {
  constructor(
    public readonly id_work_day: string,
    public readonly start_date: Date,
    public readonly start_petty_cash: number,
    public readonly id_route_day: string,
    public readonly id_user: string,
    public readonly notes: NoteObjectValue[],
    public readonly finish_date: Date | null,
    public readonly final_petty_cash: number | null,
    public readonly id_payment_stub: string | null,
  ) {}
}
