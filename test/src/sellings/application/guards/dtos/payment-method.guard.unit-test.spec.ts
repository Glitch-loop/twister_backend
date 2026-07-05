import { isPaymentMethodDto } from '@/src/sellings/application/guards/dtos/payment-method.guard';

describe('isPaymentMethodDto', () => {
  it('returns true for a valid payment method dto', () => {
    expect(isPaymentMethodDto({
      id_payment_method: 'pm-1',
      payment_method_name: 'Cash',
    })).toBe(true);
  });

  it('returns false when payment_method_name is not a string', () => {
    expect(isPaymentMethodDto({
      id_payment_method: 'pm-1',
      payment_method_name: 10,
    })).toBe(false);
  });
});
