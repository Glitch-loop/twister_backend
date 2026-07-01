import { isRouteInventoryOperationDescriptionDto } from '@/src/inventories/application/guards/dtos/route-inventory-operation-description.guard';

describe('isRouteInventoryOperationDescriptionDto', () => {
  it('returns true for a valid route inventory operation description dto', () => {
    const value: unknown = {
      id_product_operation_description: 'route-desc-1',
      price_at_moment: 12.5,
      cost_at_moment: 10.1,
      quantity: 2,
      created_at: '2026-07-01T00:00:00Z',
      id_inventory_operation: 'op-1',
      id_product: 'prod-1',
    };

    expect(isRouteInventoryOperationDescriptionDto(value)).toBe(true);
  });

  it('returns false for non-record values', () => {
    expect(isRouteInventoryOperationDescriptionDto(null)).toBe(false);
    expect(isRouteInventoryOperationDescriptionDto('invalid')).toBe(false);
  });

  it('returns false when a required field has invalid type: quantity is string', () => {
    const value: unknown = {
      id_product_operation_description: 'route-desc-2',
      price_at_moment: 12.5,
      cost_at_moment: 10.1,
      quantity: '2',
      created_at: '2026-07-01T00:00:00Z',
      id_inventory_operation: 'op-1',
      id_product: 'prod-1',
    };

    expect(isRouteInventoryOperationDescriptionDto(value)).toBe(false);
  });

  it('returns false when created_at is date type', () => {
    const value: unknown = {
      id_product_operation_description: 'route-desc-2',
      price_at_moment: 12.5,
      cost_at_moment: 10.1,
      quantity: 2,
      created_at: new Date(),
      id_inventory_operation: 'op-1',
      id_product: 'prod-1',
    };

    expect(isRouteInventoryOperationDescriptionDto(value)).toBe(false);
  });
});
