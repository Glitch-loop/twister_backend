import { isInventoryDto } from '@/src/inventories/application/guards/dtos/inventory.guard';

describe('isInventoryDto', () => {
  it('returns true for a valid inventory dto', () => {
    const value: unknown = {
      id_inventory: 'inv-1',
      inventory_context: 1,
      inventory_name: 'Main Warehouse',
      is_active: 1,
      stock_validation: 1,
      created_at: '2026-07-01T00:00:00Z',
      updated_at: '2026-07-01T00:00:00Z',
      created_by: 'user-1',
      assigned_facility: 'facility-1',
      assigned_to: 'organization-1',
      inventory_balance: [
        {
          id_inventory_balance: 'inv-bal-1',
          quantity: 10,
          min_quantity: 1,
          max_quantity: 100,
          created_at: '2026-07-01T00:00:00Z',
          updated_at: '2026-07-01T00:00:00Z',
          id_inventory: 'inv-1',
          id_product: 'prod-1',
        },
      ],
    };

    expect(isInventoryDto(value)).toBe(true);
  });

  it('returns true when nullable fields are null', () => {
    const value: unknown = {
      id_inventory: 'inv-1',
      inventory_context: 1,
      inventory_name: 'Main Warehouse',
      is_active: 1,
      stock_validation: 1,
      created_at: '2026-07-01T00:00:00Z',
      updated_at: '2026-07-01T00:00:00Z',
      created_by: 'user-1',
      assigned_facility: null,
      assigned_to: null,
      inventory_balance: [
        {
          id_inventory_balance: 'inv-bal-1',
          quantity: 10,
          min_quantity: null,
          max_quantity: null,
          created_at: '2026-07-01T00:00:00Z',
          updated_at: '2026-07-01T00:00:00Z',
          id_inventory: 'inv-1',
          id_product: 'prod-1',
        },
      ],
    };

    expect(isInventoryDto(value)).toBe(true);
  });

  it('returns false for non-record values', () => {
    expect(isInventoryDto(undefined)).toBe(false);
    expect(isInventoryDto([])).toBe(false);
  });

  it('returns false when nested balances are invalid', () => {
    const value: unknown = {
      id_inventory: 'inv-1',
      inventory_context: 1,
      inventory_name: 'Main Warehouse',
      is_active: 1,
      stock_validation: 1,
      created_at: '2026-07-01T00:00:00Z',
      updated_at: '2026-07-01T00:00:00Z',
      created_by: 'user-1',
      assigned_facility: null,
      assigned_to: null,
      inventory_balance: [
        {
          id_inventory_balance: 'inv-bal-1',
          quantity: '10',
          min_quantity: 1,
          max_quantity: 100,
          created_at: '2026-07-01T00:00:00Z',
          updated_at: '2026-07-01T00:00:00Z',
          id_inventory: 'inv-1',
          id_product: 'prod-1',
        },
      ],
    };

    expect(isInventoryDto(value)).toBe(false);
  });
});
