export class Route {
  constructor(
    public readonly id_route: string,
    public readonly route_name: string,
    public readonly route_status: number,
    public readonly description?: string,
  ) {}
}
