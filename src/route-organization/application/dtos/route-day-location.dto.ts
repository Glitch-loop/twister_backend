
export class RouteDayLocationDto {
  constructor(
    public readonly position_in_route: number,
    public readonly id_location: string,
    public readonly id_user: string,
    public readonly id_route_day_location: string,
  ) {}
}
