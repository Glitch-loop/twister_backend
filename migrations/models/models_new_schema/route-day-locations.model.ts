export class RouteDayLocationsModel {
  constructor(
    public readonly position_in_route: number,
    public readonly id_route_day_location: string,
    public readonly id_location: string,
    public readonly id_route_day: string,
  ) {}
}
