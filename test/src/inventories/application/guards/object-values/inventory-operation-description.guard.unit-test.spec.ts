import { isInventoryOperationDescriptionObjectValue } from '@/src/inventories/application/guards/object-values/inventory-operation-description.guard';

describe('isInventoryOperationDescriptionObjectValue', () => {
  it('returns true for a valid inventory operation description object value', () => {
    const value: unknown = {
      id_inventory_operation_description: 'desc-1',
      price_at_moment: 12.5,
      cost_at_moment: 10.1,
      quantity: 2,
      created_at: new Date('2026-07-01T00:00:00Z'),
      id_inventory_operation: 'op-1',
      id_product: 'prod-1',
    };

    expect(isInventoryOperationDescriptionObjectValue(value)).toBe(true);
  });

  it('returns false for non-record values', () => {
    expect(isInventoryOperationDescriptionObjectValue(undefined)).toBe(false);
    expect(isInventoryOperationDescriptionObjectValue([])).toBe(false);
  });

  it('returns false when created_at is not a Date instance', () => {
    const value: unknown = {
      id_inventory_operation_description: 'desc-2',
      price_at_moment: 12.5,
      cost_at_moment: 10.1,
      quantity: 2,
      created_at: '2026-07-01T00:00:00Z',
      id_inventory_operation: 'op-1',
      id_product: 'prod-1',
    };

    expect(isInventoryOperationDescriptionObjectValue(value)).toBe(false);
  });

  it('returns false when a required numeric field has invalid type', () => {
    const value: unknown = {
      id_inventory_operation_description: 'desc-3',
      price_at_moment: 12.5,
      cost_at_moment: '10.1',
      quantity: 2,
      created_at: new Date('2026-07-01T00:00:00Z'),
      id_inventory_operation: 'op-1',
      id_product: 'prod-1',
    };

    expect(isInventoryOperationDescriptionObjectValue(value)).toBe(false);
  });
});
