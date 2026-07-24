export class WorkDaysModel {
  constructor(
    public readonly id_work_day: string,
    public readonly start_date: string,
    public readonly finish_date: string | null,
    public readonly start_petty_cash: number,
    public readonly final_petty_cash: number | null,
    public readonly id_route_day: string,
    public readonly id_user: string,
    public readonly id_payment_stub: string | null,
  ) {}
}
