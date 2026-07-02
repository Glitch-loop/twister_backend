import { isInventoryOperationModel } from '@/src/inventories/application/guards/models/inventory-operation.guard';

describe('isInventoryOperationModel (inventory-operation.guard)', () => {
  it('returns true for a valid inventory operation model', () => {
    const value: unknown = {
      id_inventory_operation: 'op-1',
      movement_type: 1,
      created_at: '2026-07-01T00:00:00Z',
      created_by: 'user-1',
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      latitude: '10.123',
      longitude: '-20.456',
      inventory_operation_reference: 'ref-1',
      document_reference: 'doc-1',
    };

    expect(isInventoryOperationModel(value)).toBe(true);
  });

  it('returns true when nullable fields are null', () => {
    const value: unknown = {
      id_inventory_operation: 'op-2',
      movement_type: 1,
      created_at: '2026-07-01T00:00:00Z',
      created_by: 'user-1',
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      latitude: null,
      longitude: null,
      inventory_operation_reference: null,
      document_reference: null,
    };

    expect(isInventoryOperationModel(value)).toBe(true);
  });

  it('returns false for non-record values', () => {
    expect(isInventoryOperationModel(null)).toBe(false);
    expect(isInventoryOperationModel(100)).toBe(false);
  });

  it('returns false when nullable fields are undefined', () => {
    const value: unknown = {
      id_inventory_operation: 'op-3',
      movement_type: 1,
      created_at: '2026-07-01T00:00:00Z',
      created_by: 'user-1',
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      latitude: undefined,
      longitude: null,
      inventory_operation_reference: null,
      document_reference: null,
    };

    expect(isInventoryOperationModel(value)).toBe(false);
  });
});
