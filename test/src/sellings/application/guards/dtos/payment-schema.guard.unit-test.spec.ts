import { isPaymentSchemaDto } from '@/src/sellings/application/guards/dtos/payment-schema.guard';

describe('isPaymentSchemaDto', () => {
  it('returns true for a valid payment schema dto', () => {
    expect(isPaymentSchemaDto({
      id_payment_schema: 'ps-1',
      payment_schema_type: 'single payment',
    })).toBe(true);
  });

  it('returns false for non-record values', () => {
    expect(isPaymentSchemaDto(null)).toBe(false);
  });
});
