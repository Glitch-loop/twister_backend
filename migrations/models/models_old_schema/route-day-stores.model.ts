export class RouteDayStoresModel {
  constructor(
    public readonly position_in_route: number,
    public readonly id_route_day_store: string,
    public readonly id_store: string,
    public readonly id_route_day: string,
  ) {}
}
