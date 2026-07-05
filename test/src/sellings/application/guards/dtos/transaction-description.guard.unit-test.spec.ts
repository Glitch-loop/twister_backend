import { isTransactionDescriptionDto } from '@/src/sellings/application/guards/dtos/transaction-description.guard';

describe('isTransactionDescriptionDto', () => {
  it('returns true for a valid transaction description dto', () => {
    expect(isTransactionDescriptionDto({
      id_transaction_description: 'td-1',
      price_at_moment: 15,
      cost_at_moment: 12,
      quantity: 2,
      id_transaction: 'tx-1',
      id_transaction_operation_type: 'op-1',
      id_product: 'prod-1',
    })).toBe(true);
  });

  it('returns false when quantity is not a number', () => {
    expect(isTransactionDescriptionDto({
      id_transaction_description: 'td-1',
      price_at_moment: 15,
      cost_at_moment: 12,
      quantity: '2',
      id_transaction: 'tx-1',
      id_transaction_operation_type: 'op-1',
      id_product: 'prod-1',
    })).toBe(false);
  });

  it('returns false for non-record values', () => {
    expect(isTransactionDescriptionDto(undefined)).toBe(false);
  });

  it('returns false when id_transaction_operation_type is not a string', () => {
    expect(isTransactionDescriptionDto({
      id_transaction_description: 'td-1',
      price_at_moment: 15,
      cost_at_moment: 12,
      quantity: 2,
      id_transaction: 'tx-1',
      id_transaction_operation_type: 10,
      id_product: 'prod-1',
    })).toBe(false);
  });

  it('returns false when id_transaction is missing', () => {
    expect(isTransactionDescriptionDto({
      id_transaction_description: 'td-1',
      price_at_moment: 15,
      cost_at_moment: 12,
      quantity: 2,
      id_transaction_operation_type: 'op-1',
      id_product: 'prod-1',
    })).toBe(false);
  });
});
