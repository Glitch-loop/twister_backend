export class RouteDayStoreProposalsModel {
  constructor(
    public readonly id_route_day_store: string,
    public readonly created_at: string,
    public readonly position_in_route: number,
    public readonly id_route_day_proposal: string,
    public readonly id_store: string,
  ) {}
}
