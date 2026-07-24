export class RoutesModel {
  constructor(
    public readonly route_name: string,
    public readonly description: string | null,
    public readonly route_status: number,
    public readonly id_route: string,
    public readonly id_vendor: string | null,
  ) {}
}
