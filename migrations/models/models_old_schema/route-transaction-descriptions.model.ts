export class RouteTransactionDescriptionsModel {
  constructor(
    public readonly price_at_moment: number,
    public readonly amount: number,
    public readonly id_route_transaction_description: string,
    public readonly id_route_transaction: string,
    public readonly id_route_transaction_operation_type: string,
    public readonly id_product: string,
    public readonly comission_at_moment: number | null,
    public readonly created_at: string,
  ) {}
}
