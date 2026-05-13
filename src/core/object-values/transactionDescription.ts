export class TransactionDescription {
  constructor(
    public readonly id_transaction_description: string,
    public readonly price_at_moment: number,
    public readonly cost_at_moment: number,
    public readonly amount: number,
    public readonly created_at: Date,
    public readonly id_transaction: string,
    public readonly id_transaction_operation_type: string,
    public readonly id_product: string,
  ) {}
}
