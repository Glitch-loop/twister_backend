export class WorkDayEntity {
  constructor(
    public readonly id_work_day: string,
    public readonly start_date: Date,
    public readonly id_route: string,
    public readonly start_petty_cash: number,
    public readonly id_route_day: string,
    public readonly id_user: string,
    public readonly finish_date?: Date,
    public readonly final_petty_cash?: number,
    public readonly id_payment_stub?: string,
  ) {}
}
