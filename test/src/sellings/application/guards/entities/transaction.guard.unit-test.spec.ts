import { isTransactionEntity } from '@/src/sellings/application/guards/entities/transaction.guard';

describe('isTransactionEntity', () => {
  it('returns true for a valid transaction entity shape', () => {
    expect(isTransactionEntity({
      id_transaction: 'tx-1',
      state: 1,
      received_amount: 100,
      created_at: new Date('2026-01-01T00:00:00.000Z'),
      id_client: 'client-1',
      created_by: 'user-1',
      id_work_day: 'workday-1',
      id_invoice_concept: null,
      latitude: '19.4',
      longitude: '-99.1',
      cfdi: null,
      id_location: null,
    })).toBe(true);
  });

  it('returns false when id_client is not a string', () => {
    expect(isTransactionEntity({
      id_transaction: 'tx-1',
      state: 1,
      received_amount: 100,
      created_at: new Date('2026-01-01T00:00:00.000Z'),
      id_client: null,
      created_by: 'user-1',
      id_work_day: 'workday-1',
      id_invoice_concept: null,
      latitude: '19.4',
      longitude: '-99.1',
      cfdi: null,
      id_location: null,
    })).toBe(false);
  });

  it('returns false for non-record values', () => {
    expect(isTransactionEntity([])).toBe(false);
  });

  it('returns true when optional fields are strings', () => {
    expect(isTransactionEntity({
      id_transaction: 'tx-1',
      state: 1,
      received_amount: 100,
      created_at: new Date('2026-01-01T00:00:00.000Z'),
      id_client: 'client-1',
      created_by: 'user-1',
      id_work_day: 'workday-1',
      id_invoice_concept: 'invoice-1',
      latitude: '19.4',
      longitude: '-99.1',
      cfdi: 'ABCD010101ABC',
      id_location: 'location-1',
    })).toBe(true);
  });

  it('returns false when state is not a number', () => {
    expect(isTransactionEntity({
      id_transaction: 'tx-1',
      state: '1',
      received_amount: 100,
      created_at: new Date('2026-01-01T00:00:00.000Z'),
      id_client: 'client-1',
      created_by: 'user-1',
      id_work_day: 'workday-1',
      id_invoice_concept: null,
      latitude: '19.4',
      longitude: '-99.1',
      cfdi: null,
      id_location: null,
    })).toBe(false);
  });
});
