import { isInventoryBalanceDto } from '@/src/inventories/application/guards/dtos/inventory-balance.guard';

describe('isInventoryBalanceDto', () => {
  it('returns true for a valid inventory balance dto', () => {
    const value: unknown = {
      id_inventory_balance: 'inv-bal-1',
      quantity: 10,
      min_quantity: 1,
      max_quantity: 100,
      created_at: '2026-07-01T00:00:00Z',
      id_inventory: 'inv-1',
      id_product: 'prod-1',
    };

    expect(isInventoryBalanceDto(value)).toBe(true);
  });

  it('returns true when nullable fields are null', () => {
    const value: unknown = {
      id_inventory_balance: 'inv-bal-2',
      quantity: 5,
      min_quantity: null,
      max_quantity: null,
      created_at: '2026-07-01T00:00:00Z',
      id_inventory: 'inv-1',
      id_product: 'prod-1',
    };

    expect(isInventoryBalanceDto(value)).toBe(true);
  });

  it('returns false for non-record values', () => {
    expect(isInventoryBalanceDto(null)).toBe(false);
    expect(isInventoryBalanceDto('invalid')).toBe(false);
    expect(isInventoryBalanceDto(123)).toBe(false);
  });

  it('returns false when a required field has invalid type', () => {
    const value: unknown = {
      id_inventory_balance: 'inv-bal-3',
      quantity: '10',
      min_quantity: 1,
      max_quantity: 100,
      created_at: '2026-07-01T00:00:00Z',
      id_inventory: 'inv-1',
      id_product: 'prod-1',
    };

    expect(isInventoryBalanceDto(value)).toBe(false);
  });
});
