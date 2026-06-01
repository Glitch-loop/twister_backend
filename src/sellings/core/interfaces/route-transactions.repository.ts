import { PaymentMethodObjectValue } from "@/src/sellings/core/value-objects/payment-method.object-value";
import { PaymentSchemaObjectValue } from "@/src/sellings/core/value-objects/payment-schema.object-value";
import { TaxInTransactionObjectValue } from "@/src/sellings/core/value-objects/tax-in-transaction.object-value";
import { TransactionDescriptionObjectValue } from "@/src/sellings/core/value-objects/transaction-description.object-value";

export abstract class RouteTransactionRepository {
  abstract listPaymentMethods(): Promise<PaymentMethodObjectValue>
  abstract listPaymentSchema(): Promise<PaymentSchemaObjectValue>
  abstract listTaxes(): Promise<PaymentSchemaObjectValue>
  abstract retrieveTaxesInTransactionByIdTransaction(idTransaction: string): Promise<TaxInTransactionObjectValue>
  abstract retrieveRouteTransactionDescriptionByIdTransaction(idTransaction: string): Promise<TransactionDescriptionObjectValue>
  abstract listTransactions(
    limit?: number,
    nextCreatedAt?: string, // Id transaction
    nextId?: string, // Id transaction
    cfdi?: string,
    received_amount?: string,
    transaction_status?: number[],
    id_location?: string[],
    id_client?: string[],
    id_work_day?: string[],
    id_payment_method?: string[],
    id_payment_schema?: string[],
  )
}