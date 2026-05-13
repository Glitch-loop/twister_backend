export class RouteDayLocation {
  constructor(
    public readonly position_in_route: number,
    public readonly id_location: string,
    public readonly id_owner: string, // route day or route day proposal
    public readonly id_route_day_location?: string,
    public readonly id_route_day_location_proposal?: string,
  ) {}
}
