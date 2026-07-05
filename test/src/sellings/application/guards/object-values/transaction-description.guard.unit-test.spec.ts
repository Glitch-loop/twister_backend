import { isTransactionDescriptionObjectValue } from '@/src/sellings/application/guards/object-values/transaction-description.guard';

describe('isTransactionDescriptionObjectValue', () => {
  it('returns true for a valid transaction description object value', () => {
    expect(isTransactionDescriptionObjectValue({
      id_transaction_description: 'td-1',
      price_at_moment: 10,
      cost_at_moment: 8,
      quantity: 1,
      id_transaction: 'tx-1',
      id_transaction_operation_type: 'op-1',
      id_product: 'prod-1',
    })).toBe(true);
  });

  it('returns false when id_product is not a string', () => {
    expect(isTransactionDescriptionObjectValue({
      id_transaction_description: 'td-1',
      price_at_moment: 10,
      cost_at_moment: 8,
      quantity: 1,
      id_transaction: 'tx-1',
      id_transaction_operation_type: 'op-1',
      id_product: 1,
    })).toBe(false);
  });

  it('returns false for non-record values', () => {
    expect(isTransactionDescriptionObjectValue(null)).toBe(false);
  });

  it('returns false when cost_at_moment is not a number', () => {
    expect(isTransactionDescriptionObjectValue({
      id_transaction_description: 'td-1',
      price_at_moment: 10,
      cost_at_moment: '8',
      quantity: 1,
      id_transaction: 'tx-1',
      id_transaction_operation_type: 'op-1',
      id_product: 'prod-1',
    })).toBe(false);
  });

  it('returns false when id_transaction_operation_type is missing', () => {
    expect(isTransactionDescriptionObjectValue({
      id_transaction_description: 'td-1',
      price_at_moment: 10,
      cost_at_moment: 8,
      quantity: 1,
      id_transaction: 'tx-1',
      id_product: 'prod-1',
    })).toBe(false);
  });
});
