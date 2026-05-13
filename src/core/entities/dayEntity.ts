export class DayEntity {
  constructor(
    public readonly day_name: string,
    public readonly id_day: string,
    public readonly order_to_show: number,
  ) {}
}
