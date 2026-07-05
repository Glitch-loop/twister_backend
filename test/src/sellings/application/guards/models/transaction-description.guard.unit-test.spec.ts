import { isTransactionDescriptionModel } from '@/src/sellings/application/guards/models/transaction-description.guard';

describe('isTransactionDescriptionModel', () => {
  it('returns true for a valid transaction description model', () => {
    expect(isTransactionDescriptionModel({
      id_transaction_description: 'td-1',
      price_at_moment: 10,
      cost_at_moment: 8,
      quantity: 1,
      id_transaction: 'tx-1',
      id_transaction_operation_type: 'op-1',
      id_product: 'prod-1',
    })).toBe(true);
  });

  it('returns false when price_at_moment is not a number', () => {
    expect(isTransactionDescriptionModel({
      id_transaction_description: 'td-1',
      price_at_moment: '10',
      cost_at_moment: 8,
      quantity: 1,
      id_transaction: 'tx-1',
      id_transaction_operation_type: 'op-1',
      id_product: 'prod-1',
    })).toBe(false);
  });
});
