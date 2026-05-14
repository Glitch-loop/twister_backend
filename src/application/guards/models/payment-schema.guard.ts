import type { PaymentSchemaModel } from '../../models/payment-schema.model';

import { isRecord } from '../utils';

export const isPaymentSchemaModel = (value: unknown): value is PaymentSchemaModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_payment_schema === 'string' &&
    typeof value.payment_schema_type === 'string'
  );
};
