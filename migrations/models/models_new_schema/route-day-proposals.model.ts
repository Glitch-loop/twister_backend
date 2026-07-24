export class RouteDayProposalsModel {
  constructor(
    public readonly id_route_day_proposal: string,
    public readonly proposal_name: string,
    public readonly created_at: string,
    public readonly id_route_day: string,
  ) {}
}
