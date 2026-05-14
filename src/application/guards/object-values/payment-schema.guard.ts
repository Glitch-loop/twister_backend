import type { PaymentSchemaObjectValue } from '@/src/core/object-values/payment-schema.object-value';
import { isRecord } from '@/src/application/guards/utils';

export const isPaymentSchemaObjectValue = (value: unknown): value is PaymentSchemaObjectValue => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_payment_schema === 'string' &&
    typeof value.payment_schema_type === 'string'
  );
};