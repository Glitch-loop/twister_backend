import { isTransactionDto } from '@/src/sellings/application/guards/dtos/transaction.guard';

describe('isTransactionDto', () => {
  it('returns true for a valid transaction dto with nested dtos', () => {
    expect(isTransactionDto({
      id_transaction: 'tx-1',
      cfdi: null,
      state: 1,
      received_amount: 100,
      created_by: 'user-1',
      id_invoice_concept: null,
      latitude: '19.4',
      longitude: '-99.1',
      id_location: null,
      id_client: 'client-1',
      id_work_day: 'workday-1',
      payment_method: {
        id_payment_method: 'pm-1',
        payment_method_name: 'Cash',
      },
      payment_schema: {
        id_payment_schema: 'ps-1',
        payment_schema_type: 'single payment',
      },
      transaction_descriptions: [
        {
          id_transaction_description: 'td-1',
          price_at_moment: 10,
          cost_at_moment: 8,
          quantity: 1,
          id_transaction: 'tx-1',
          id_transaction_operation_type: 'op-1',
          id_product: 'prod-1',
        },
      ],
    })).toBe(true);
  });

  it('returns false when nested payment_method is invalid', () => {
    expect(isTransactionDto({
      id_transaction: 'tx-1',
      cfdi: null,
      state: 1,
      received_amount: 100,
      created_by: 'user-1',
      id_invoice_concept: null,
      latitude: '19.4',
      longitude: '-99.1',
      id_location: null,
      id_client: 'client-1',
      id_work_day: 'workday-1',
      payment_method: {
        id_payment_method: 'pm-1',
      },
      payment_schema: {
        id_payment_schema: 'ps-1',
        payment_schema_type: 'single payment',
      },
      transaction_descriptions: [],
    })).toBe(false);
  });

  it('returns false for non-record values', () => {
    expect(isTransactionDto(null)).toBe(false);
  });

  it('returns false when transaction_descriptions is not an array', () => {
    expect(isTransactionDto({
      id_transaction: 'tx-1',
      cfdi: null,
      state: 1,
      received_amount: 100,
      created_by: 'user-1',
      id_invoice_concept: null,
      latitude: '19.4',
      longitude: '-99.1',
      id_location: null,
      id_client: 'client-1',
      id_work_day: 'workday-1',
      payment_method: {
        id_payment_method: 'pm-1',
        payment_method_name: 'Cash',
      },
      payment_schema: {
        id_payment_schema: 'ps-1',
        payment_schema_type: 'single payment',
      },
      transaction_descriptions: 'invalid',
    })).toBe(false);
  });

  it('returns false when one nested description is invalid', () => {
    expect(isTransactionDto({
      id_transaction: 'tx-1',
      cfdi: 'ABCD010101ABC',
      state: 1,
      received_amount: 100,
      created_by: 'user-1',
      id_invoice_concept: 'invoice-1',
      latitude: null,
      longitude: null,
      id_location: 'location-1',
      id_client: 'client-1',
      id_work_day: 'workday-1',
      payment_method: {
        id_payment_method: 'pm-1',
        payment_method_name: 'Cash',
      },
      payment_schema: {
        id_payment_schema: 'ps-1',
        payment_schema_type: 'single payment',
      },
      transaction_descriptions: [
        {
          id_transaction_description: 'td-1',
          price_at_moment: 10,
          cost_at_moment: 8,
          quantity: '1',
          id_transaction: 'tx-1',
          id_transaction_operation_type: 'op-1',
          id_product: 'prod-1',
        },
      ],
    })).toBe(false);
  });
});
