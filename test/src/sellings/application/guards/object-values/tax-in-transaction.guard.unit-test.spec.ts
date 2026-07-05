import { isTaxInTransactionObjectValue } from '@/src/sellings/application/guards/object-values/tax-in-transaction.guard';

describe('isTaxInTransactionObjectValue', () => {
  it('returns true for a valid tax in transaction object value', () => {
    expect(isTaxInTransactionObjectValue({
      id_tax_in_transaction: 'tit-1',
      id_transaction: 'tx-1',
      id_tax: 'tax-1',
      tax_rate_at_moment_of_transaction: 16,
    })).toBe(true);
  });

  it('returns false when tax_rate_at_moment_of_transaction is not a number', () => {
    expect(isTaxInTransactionObjectValue({
      id_tax_in_transaction: 'tit-1',
      id_transaction: 'tx-1',
      id_tax: 'tax-1',
      tax_rate_at_moment_of_transaction: '16',
    })).toBe(false);
  });
});
