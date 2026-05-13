export class RouteDayProposal {
  constructor(
    public readonly id_route_day_proposal: string,
    public readonly proposal_name: string,
    public readonly created_at: Date,
    public readonly id_route_day: string,
  ) {}
}
