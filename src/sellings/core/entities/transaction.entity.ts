// Enum
import { TRANSACTION_STATUS_ENUM } from "@/src/sellings/core/enums/route-status.enum";

// Object value
import { PaymentMethodObjectValue } from "@/src/sellings/core/value-objects/payment-method.object-value";
import { PaymentSchemaObjectValue } from "@/src/sellings/core/value-objects/payment-schema.object-value";
import { TransactionDescriptionObjectValue } from "@/src/sellings/core/value-objects/transaction-description.object-value";

export class TransactionEntity {
  constructor(
    public readonly id_transaction: string,
    public readonly state: TRANSACTION_STATUS_ENUM,
    public readonly received_amount: number,
    public readonly created_at: Date,
    public readonly id_client: string,
    public readonly created_by: string,
    public readonly id_work_day: string,
    public readonly payment_method: PaymentMethodObjectValue,
    public readonly payment_schema: PaymentSchemaObjectValue,
    public readonly transaction_descriptions: TransactionDescriptionObjectValue[],
    public readonly id_invoice_concept: string | null,
    public readonly latitude: string | null,
    public readonly longitude: string | null,
    public readonly cfdi: string | null,
    public readonly id_location: string | null,
  ) {}
}
