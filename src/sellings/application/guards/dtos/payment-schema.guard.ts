import type { PaymentSchemaDto } from '@/src/sellings/application/dtos/payment-schema.dto';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isPaymentSchemaDto = (value: unknown): value is PaymentSchemaDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_payment_schema === 'string' &&
    typeof value.payment_schema_type === 'string'
  );
};
