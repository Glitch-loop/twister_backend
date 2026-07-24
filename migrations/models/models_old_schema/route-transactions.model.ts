export class RouteTransactionsModel {
  constructor(
    public readonly date: string,
    public readonly state: number,
    public readonly id_route_transaction: string,
    public readonly id_work_day: string,
    public readonly id_store: string,
    public readonly id_payment_method: string,
    public readonly cash_received: number,
  ) {}
}
