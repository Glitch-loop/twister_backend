export class WorkDaysModel {
  constructor(
    public readonly start_date: string,
    public readonly finish_date: string | null,
    public readonly id_work_day: string,
    public readonly id_route: string,
    public readonly id_vendor: string,
    public readonly id_commission: string | null,
    public readonly start_petty_cash: number,
    public readonly final_petty_cash: number | null,
    public readonly comment: string | null,
    public readonly id_route_day: string,
  ) {}
}
