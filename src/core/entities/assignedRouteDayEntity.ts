export class AssignedRouteDayEntity {
  constructor(
    public readonly id_assigned_route_day: string,
    public readonly created_at: Date,
    public readonly id_route_day: string,
    public readonly id_user: string,
    public readonly expired_at?: Date,
  ) {}
}
