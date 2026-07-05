import { isTaxInTransactionModel } from '@/src/sellings/application/guards/models/tax-in-transaction.guard';

describe('isTaxInTransactionModel', () => {
  it('returns true for a valid tax in transaction model', () => {
    expect(isTaxInTransactionModel({
      id_tax_in_transaction: 'tit-1',
      id_transaction: 'tx-1',
      id_tax: 'tax-1',
      tax_rate_at_moment_of_transaction: 16,
    })).toBe(true);
  });

  it('returns false when id_tax is not a string', () => {
    expect(isTaxInTransactionModel({
      id_tax_in_transaction: 'tit-1',
      id_transaction: 'tx-1',
      id_tax: 10,
      tax_rate_at_moment_of_transaction: 16,
    })).toBe(false);
  });
});
