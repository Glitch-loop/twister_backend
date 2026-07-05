import { isTransactionModel } from '@/src/sellings/application/guards/models/transaction.guard';

describe('isTransactionModel', () => {
  it('returns true for a valid transaction model', () => {
    expect(isTransactionModel({
      id_transaction: 'tx-1',
      cfdi: null,
      state: 1,
      received_amount: 50,
      created_by: 'user-1',
      id_invoice_concept: null,
      created_at: '2026-01-01T00:00:00.000Z',
      latitude: '19.4',
      longitude: '-99.1',
      id_location: null,
      id_client: 'client-1',
      id_work_day: 'workday-1',
      id_payment_method: 'pm-1',
      id_payment_schema: 'ps-1',
    })).toBe(true);
  });

  it('returns false when id_payment_schema is not a string', () => {
    expect(isTransactionModel({
      id_transaction: 'tx-1',
      cfdi: null,
      state: 1,
      received_amount: 50,
      created_by: 'user-1',
      id_invoice_concept: null,
      created_at: '2026-01-01T00:00:00.000Z',
      latitude: '19.4',
      longitude: '-99.1',
      id_location: null,
      id_client: 'client-1',
      id_work_day: 'workday-1',
      id_payment_method: 'pm-1',
      id_payment_schema: 1,
    })).toBe(false);
  });

  it('returns false for non-record values', () => {
    expect(isTransactionModel('invalid')).toBe(false);
  });

  it('returns true when nullable fields are provided as strings', () => {
    expect(isTransactionModel({
      id_transaction: 'tx-1',
      cfdi: 'ABCD010101ABC',
      state: 1,
      received_amount: 50,
      created_by: 'user-1',
      id_invoice_concept: 'invoice-1',
      created_at: '2026-01-01T00:00:00.000Z',
      latitude: '19.4',
      longitude: '-99.1',
      id_location: 'location-1',
      id_client: 'client-1',
      id_work_day: 'workday-1',
      id_payment_method: 'pm-1',
      id_payment_schema: 'ps-1',
    })).toBe(true);
  });

  it('returns false when latitude is not string or null', () => {
    expect(isTransactionModel({
      id_transaction: 'tx-1',
      cfdi: null,
      state: 1,
      received_amount: 50,
      created_by: 'user-1',
      id_invoice_concept: null,
      created_at: '2026-01-01T00:00:00.000Z',
      latitude: 19.4,
      longitude: '-99.1',
      id_location: null,
      id_client: 'client-1',
      id_work_day: 'workday-1',
      id_payment_method: 'pm-1',
      id_payment_schema: 'ps-1',
    })).toBe(false);
  });
});
