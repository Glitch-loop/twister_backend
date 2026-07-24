export class RouteDayLocationProposalsModel {
  constructor(
    public readonly id_route_day_location_proposal: string,
    public readonly position_in_route: number,
    public readonly id_route_day_proposal: string,
    public readonly id_location: string,
  ) {}
}
