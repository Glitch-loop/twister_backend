import { isTaxInTransactionDto } from '@/src/sellings/application/guards/dtos/tax-in-transaction.guard';

describe('isTaxInTransactionDto', () => {
  it('returns true for a valid tax in transaction dto', () => {
    expect(isTaxInTransactionDto({
      id_tax_in_transaction: 'tit-1',
      id_transaction: 'tx-1',
      id_tax: 'tax-1',
      tax_rate_at_moment_of_transaction: 16,
    })).toBe(true);
  });

  it('returns false when tax_rate_at_moment_of_transaction is not a number', () => {
    expect(isTaxInTransactionDto({
      id_tax_in_transaction: 'tit-1',
      id_transaction: 'tx-1',
      id_tax: 'tax-1',
      tax_rate_at_moment_of_transaction: '16',
    })).toBe(false);
  });
});
