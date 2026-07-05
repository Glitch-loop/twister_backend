import { isPaymentSchemaModel } from '@/src/sellings/application/guards/models/payment-schema.guard';

describe('isPaymentSchemaModel', () => {
  it('returns true for a valid payment schema model', () => {
    expect(isPaymentSchemaModel({
      id_payment_schema: 'ps-1',
      payment_schema_type: 'single payment',
    })).toBe(true);
  });

  it('returns false for non-record values', () => {
    expect(isPaymentSchemaModel(undefined)).toBe(false);
  });
});
