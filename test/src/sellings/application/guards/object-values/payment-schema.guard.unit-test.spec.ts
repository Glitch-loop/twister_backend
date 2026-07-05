import { isPaymentSchemaObjectValue } from '@/src/sellings/application/guards/object-values/payment-schema.guard';

describe('isPaymentSchemaObjectValue', () => {
  it('returns true for a valid payment schema object value', () => {
    expect(isPaymentSchemaObjectValue({
      id_payment_schema: 'ps-1',
      payment_schema_type: 'single payment',
    })).toBe(true);
  });

  it('returns false when payment_schema_type is not a string', () => {
    expect(isPaymentSchemaObjectValue({
      id_payment_schema: 'ps-1',
      payment_schema_type: 10,
    })).toBe(false);
  });
});
