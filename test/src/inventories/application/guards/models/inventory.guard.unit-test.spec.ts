import { isInventoryModel } from '@/src/inventories/application/guards/models/inventory.guard';

describe('isInventoryModel', () => {
  it('returns true for a valid inventory model', () => {
    const value: unknown = {
      id_inventory: 'inv-1',
      inventory_context: 1,
      inventory_name: 'Main Warehouse',
      is_active: 1,
      stock_validation: 1,
      created_at: 1751328000000,
      created_by: 99,
      assigned_to: 'organization-1',
      assigned_facility: 'facility-1',
    };

    expect(isInventoryModel(value)).toBe(true);
  });

  it('returns true when nullable fields are null', () => {
    const value: unknown = {
      id_inventory: 'inv-2',
      inventory_context: 1,
      inventory_name: 'Main Warehouse',
      is_active: 1,
      stock_validation: 1,
      created_at: 1751328000000,
      created_by: 99,
      assigned_to: null,
      assigned_facility: null,
    };

    expect(isInventoryModel(value)).toBe(true);
  });

  it('returns false for non-record values', () => {
    expect(isInventoryModel(undefined)).toBe(false);
    expect(isInventoryModel([])).toBe(false);
  });

  it('returns false when required fields have invalid types', () => {
    const value: unknown = {
      id_inventory: 'inv-3',
      inventory_context: 1,
      inventory_name: 'Main Warehouse',
      is_active: 1,
      stock_validation: 1,
      created_at: '2026-07-01T00:00:00Z',
      created_by: '99',
      assigned_to: null,
      assigned_facility: null,
    };

    expect(isInventoryModel(value)).toBe(false);
  });
});
