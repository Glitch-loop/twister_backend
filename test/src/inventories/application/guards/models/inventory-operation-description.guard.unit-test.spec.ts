import { isInventoryOperationDescriptionModel } from '@/src/inventories/application/guards/models/inventory-operation-description.guard';

describe('isInventoryOperationModel (inventory-operation-description.guard)', () => {
  it('returns true for a valid inventory operation description model', () => {
    const value: unknown = {
      id_inventory_operation_description: 'desc-1',
      price_at_moment: 12.5,
      cost_at_moment: 10.1,
      quantity: 2,
      created_at: '2026-07-01T00:00:00Z',
      id_inventory_operation: 'op-1',
      id_product: 'prod-1',
    };

    expect(isInventoryOperationDescriptionModel(value)).toBe(true);
  });

  it('returns false for non-record values', () => {
    expect(isInventoryOperationDescriptionModel(undefined)).toBe(false);
    expect(isInventoryOperationDescriptionModel([])).toBe(false);
  });

  it('returns false when a required field has invalid type', () => {
    const value: unknown = {
      id_inventory_operation_description: 'desc-2',
      price_at_moment: 12.5,
      cost_at_moment: '10.1',
      quantity: 2,
      created_at: '2026-07-01T00:00:00Z',
      id_inventory_operation: 'op-1',
      id_product: 'prod-1',
    };

    expect(isInventoryOperationDescriptionModel(value)).toBe(false);
  });
});
