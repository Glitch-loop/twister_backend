import { isInventoryBalanceModel } from '@/src/inventories/application/guards/models/inventory-balance.guard';

describe('isInventoryBalanceModel', () => {
  it('returns true for a valid inventory balance model', () => {
    const value: unknown = {
      id_inventory_balance: 'inv-bal-1',
      quantity: 10,
      min_quantity: 1,
      max_quantity: 100,
      created_at: '2026-07-01T00:00:00Z',
      updated_at: '2026-07-01T01:00:00Z',
      id_inventory: 'inv-1',
      id_product: 'prod-1',
    };

    expect(isInventoryBalanceModel(value)).toBe(true);
  });

  it('returns true when min_quantity and max_quantity are null', () => {
    const value: unknown = {
      id_inventory_balance: 'inv-bal-2',
      quantity: 10,
      min_quantity: null,
      max_quantity: null,
      created_at: '2026-07-01T00:00:00Z',
      updated_at: '2026-07-01T01:00:00Z',
      id_inventory: 'inv-1',
      id_product: 'prod-1',
    };

    expect(isInventoryBalanceModel(value)).toBe(true);
  });

  it('returns false for non-record values', () => {
    expect(isInventoryBalanceModel(null)).toBe(false);
    expect(isInventoryBalanceModel('invalid')).toBe(false);
  });

  it('returns false when a required field has invalid type', () => {
    const value: unknown = {
      id_inventory_balance: 'inv-bal-3',
      quantity: '10',
      min_quantity: 1,
      max_quantity: 100,
      created_at: '2026-07-01T00:00:00Z',
      updated_at: '2026-07-01T01:00:00Z',
      id_inventory: 'inv-1',
      id_product: 'prod-1',
    };

    expect(isInventoryBalanceModel(value)).toBe(false);
  });
});
