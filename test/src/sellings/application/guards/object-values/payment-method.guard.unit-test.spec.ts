import { isPaymentMethodObjectValue } from '@/src/sellings/application/guards/object-values/payment-method.guard';

describe('isPaymentMethodObjectValue', () => {
  it('returns true for a valid payment method object value', () => {
    expect(isPaymentMethodObjectValue({
      id_payment_method: 'pm-1',
      payment_method_name: 'Cash',
    })).toBe(true);
  });

  it('returns false when id_payment_method is missing', () => {
    expect(isPaymentMethodObjectValue({
      payment_method_name: 'Cash',
    })).toBe(false);
  });
});
