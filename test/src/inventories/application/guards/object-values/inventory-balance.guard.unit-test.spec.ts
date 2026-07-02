import { isInventoryBalanceObjectValue } from '@/src/inventories/application/guards/object-values/inventory-balance.guard';

describe('isInventoryBalanceObjectValue', () => {
  it('returns true for a valid inventory balance object value', () => {
    const value: unknown = {
      id_inventory_balance: 'inv-bal-1',
      quantity: 10,
      min_quantity: 1,
      max_quantity: 100,
      created_at: new Date('2026-07-01T00:00:00Z'),
      updated_at: new Date('2026-07-01T00:00:00Z'),
      id_inventory: 'inv-1',
      id_product: 'prod-1',
    };

    expect(isInventoryBalanceObjectValue(value)).toBe(true);
  });

  it('returns true when nullable min_quantity and max_quantity are null', () => {
    const value: unknown = {
      id_inventory_balance: 'inv-bal-2',
      quantity: 10,
      min_quantity: null,
      max_quantity: null,
      created_at: new Date('2026-07-01T00:00:00Z'),
      updated_at: new Date('2026-07-01T00:00:00Z'),
      id_inventory: 'inv-1',
      id_product: 'prod-1',
    };

    expect(isInventoryBalanceObjectValue(value)).toBe(true);
  });

  it('returns false for non-record values', () => {
    expect(isInventoryBalanceObjectValue(null)).toBe(false);
    expect(isInventoryBalanceObjectValue('invalid')).toBe(false);
    expect(isInventoryBalanceObjectValue(123)).toBe(false);
  });

  it('returns false when created_at is not a Date instance', () => {
    const value: unknown = {
      id_inventory_balance: 'inv-bal-3',
      quantity: 10,
      min_quantity: 1,
      max_quantity: 100,
      created_at: '2026-07-01T00:00:00Z',
      updated_at: new Date('2026-07-01T00:00:00Z'),
      id_inventory: 'inv-1',
      id_product: 'prod-1',
    };

    expect(isInventoryBalanceObjectValue(value)).toBe(false);
  });

  it('returns false when updated_at is not a Date instance', () => {
    const value: unknown = {
      id_inventory_balance: 'inv-bal-3',
      quantity: 10,
      min_quantity: 1,
      max_quantity: 100,
      created_at: new Date('2026-07-01T00:00:00Z'),
      updated_at: '2026-07-01T00:00:00Z',
      id_inventory: 'inv-1',
      id_product: 'prod-1',
    };

    expect(isInventoryBalanceObjectValue(value)).toBe(false);
  });

  it('returns false when nullable fields have invalid types', () => {
    const value: unknown = {
      id_inventory_balance: 'inv-bal-4',
      quantity: 10,
      min_quantity: '1',
      max_quantity: null,
      created_at: new Date('2026-07-01T00:00:00Z'),
      updated_at: new Date('2026-07-01T00:00:00Z'),
      id_inventory: 'inv-1',
      id_product: 'prod-1',
    };

    expect(isInventoryBalanceObjectValue(value)).toBe(false);
  });
});
