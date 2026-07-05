import { isPaymentMethodModel } from '@/src/sellings/application/guards/models/payment.method.guard';

describe('isPaymentMethodModel', () => {
  it('returns true for a valid payment method model', () => {
    expect(isPaymentMethodModel({
      id_payment_method: 'pm-1',
      payment_method_name: 'Cash',
    })).toBe(true);
  });

  it('returns false when payment_method_name is not a string', () => {
    expect(isPaymentMethodModel({
      id_payment_method: 'pm-1',
      payment_method_name: 1,
    })).toBe(false);
  });
});
