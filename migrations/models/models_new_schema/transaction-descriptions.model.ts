export class TransactionDescriptionsModel {
  constructor(
    public readonly id_transaction_description: string,
    public readonly id_transaction: string,
    public readonly id_product: string,
    public readonly id_transaction_operation_type: string,
    public readonly price_at_moment: number,
    public readonly cost_at_moment: number,
    public readonly quantity: number,
    public readonly created_at: string,
  ) {}
}
