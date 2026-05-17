import type { PaymentMethodModel } from '@/src/application/models/payment.method.model';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isPaymentMethodModel = (value: unknown): value is PaymentMethodModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_payment_method === 'string' &&
    typeof value.payment_method_name === 'string'
  );
};
