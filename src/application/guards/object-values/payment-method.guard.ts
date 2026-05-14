import type { PaymentMethodObjectValue } from '@/src/core/object-values/payment-method.object-value';
import { isRecord } from '@/src/application/guards/utils';

export const isPaymentMethodObjectValue = (value: unknown): value is PaymentMethodObjectValue => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_payment_method === 'string' &&
    typeof value.payment_method_name === 'string'
  );
};