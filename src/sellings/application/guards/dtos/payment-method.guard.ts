import type { PaymentMethodDto } from '@/src/sellings/application/dtos/payment-method.dto';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isPaymentMethodDto = (value: unknown): value is PaymentMethodDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_payment_method === 'string' &&
    typeof value.payment_method_name === 'string'
  );
};
