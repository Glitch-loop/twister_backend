export class RoutesModel {
  constructor(
    public readonly id_route: string,
    public readonly route_name: string,
    public readonly description: string | null,
    public readonly route_status: number,
  ) {}
}
