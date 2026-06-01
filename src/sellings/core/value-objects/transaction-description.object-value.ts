import { ROUTE_TRANSACTION_OPERATION_TYPE } from "@/src/sellings/core/enums/route-transaction-operation-type.enum";

export class TransactionDescriptionObjectValue {
  constructor(
    public readonly id_transaction_description: string,
    public readonly price_at_moment: number,
    public readonly cost_at_moment: number,
    public readonly amount: number,
    public readonly created_at: Date,
    public readonly id_transaction: string,
    public readonly id_transaction_operation_type: ROUTE_TRANSACTION_OPERATION_TYPE,
    public readonly id_product: string,
  ) {}
}
