import { isInventoryOperationEntity } from '@/src/inventories/application/guards/entities/inventory-operation.guard';

describe('isInventoryOperationEntity', () => {
  it('returns true for a valid inventory operation entity', () => {
    const value: unknown = {
      id_inventory_operation: 'op-1',
      latitude: '10.123',
      longitude: '-20.456',
      inventory_operation_reference: 'reference-1',
      movement_type: 1,
      document_reference: 'document-1',
      created_at: new Date('2026-07-01T00:00:00Z'),
      created_by: 'user-1',
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      inventory_operation_descriptions: [
        {
          id_inventory_operation_description: 'desc-1',
          price_at_moment: 12.5,
          cost_at_moment: 10.1,
          quantity: 2,
          created_at: new Date('2026-07-01T00:00:00Z'),
          id_inventory_operation: 'op-1',
          id_product: 'prod-1',
        },
      ],
    };

    expect(isInventoryOperationEntity(value)).toBe(true);
  });

  it('returns true when nullable fields are null', () => {
    const value: unknown = {
      id_inventory_operation: 'op-2',
      latitude: null,
      longitude: null,
      inventory_operation_reference: null,
      movement_type: 1,
      document_reference: null,
      created_at: new Date('2026-07-01T00:00:00Z'),
      created_by: 'user-1',
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      inventory_operation_descriptions: [
        {
          id_inventory_operation_description: 'desc-1',
          price_at_moment: 12.5,
          cost_at_moment: 10.1,
          quantity: 2,
          created_at: new Date('2026-07-01T00:00:00Z'),
          id_inventory_operation: 'op-2',
          id_product: 'prod-1',
        },
      ],
    };

    expect(isInventoryOperationEntity(value)).toBe(true);
  });

  it('returns true when latitude and longitude are null', () => {
    const value: unknown = {
      id_inventory_operation: 'op-3',
      latitude: null,
      longitude: null,
      inventory_operation_reference: null,
      movement_type: 1,
      document_reference: null,
      created_at: new Date('2026-07-01T00:00:00Z'),
      created_by: 'user-1',
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      inventory_operation_descriptions: [
        {
          id_inventory_operation_description: 'desc-1',
          price_at_moment: 12.5,
          cost_at_moment: 10.1,
          quantity: 2,
          created_at: new Date('2026-07-01T00:00:00Z'),
          id_inventory_operation: 'op-3',
          id_product: 'prod-1',
        },
      ],
    };

    expect(isInventoryOperationEntity(value)).toBe(true);
  });

  it('returns false for non-record values', () => {
    expect(isInventoryOperationEntity(null)).toBe(false);
    expect(isInventoryOperationEntity('invalid')).toBe(false);
  });

  it('returns false when inventory_operation_reference is null', () => {
    const value: unknown = {
      id_inventory_operation: 'op-4',
      latitude: '10.123',
      longitude: '-20.456',
      movement_type: 1,
      created_at: new Date('2026-07-01T00:00:00Z'),
      created_by: 'user-1',
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      inventory_operation_descriptions: [
        {
          id_inventory_operation_description: 'desc-1',
          price_at_moment: 12.5,
          cost_at_moment: 10.1,
          quantity: 2,
          created_at: new Date('2026-07-01T00:00:00Z'),
          id_inventory_operation: 'op-4',
          id_product: 'prod-1',
        },
      ],
      inventory_operation_reference: null,
      document_reference: 'document-1',
    };

    expect(isInventoryOperationEntity(value)).toBe(true);
  });

  it('returns true when document_reference is null', () => {
    const value: unknown = {
      id_inventory_operation: 'op-5',
      latitude: '10.123',
      longitude: '-20.456',
      inventory_operation_reference: 'reference-1',
      movement_type: 1,
      document_reference: null,
      created_by: 'user-1',
      created_at: new Date('2026-07-01T00:00:00Z'),
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      inventory_operation_descriptions: [
        {
          id_inventory_operation_description: 'desc-1',
          price_at_moment: 12.5,
          cost_at_moment: 10.1,
          quantity: 2,
          created_at: new Date('2026-07-01T00:00:00Z'),
          id_inventory_operation: 'op-5',
          id_product: 'prod-1',
        },
      ],
    };

    expect(isInventoryOperationEntity(value)).toBe(true);
  });

  it('returns false when inventory_operation_reference is undefined', () => {
    const value: unknown = {
      id_inventory_operation: 'op-5b',
      latitude: '10.123',
      longitude: '-20.456',
      movement_type: 1,
      document_reference: 'document-1',
      created_at: new Date('2026-07-01T00:00:00Z'),
      created_by: 'user-1',
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      inventory_operation_descriptions: [
        {
          id_inventory_operation_description: 'desc-1',
          price_at_moment: 12.5,
          cost_at_moment: 10.1,
          quantity: 2,
          created_at: new Date('2026-07-01T00:00:00Z'),
          id_inventory_operation: 'op-5b',
          id_product: 'prod-1',
        },
      ],
    };

    expect(isInventoryOperationEntity(value)).toBe(false);
  });

  it('returns false when document_reference is undefined', () => {
    const value: unknown = {
      id_inventory_operation: 'op-5c',
      latitude: '10.123',
      longitude: '-20.456',
      inventory_operation_reference: 'reference-1',
      movement_type: 1,
      created_at: new Date('2026-07-01T00:00:00Z'),
      created_by: 'user-1',
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      inventory_operation_descriptions: [
        {
          id_inventory_operation_description: 'desc-1',
          price_at_moment: 12.5,
          cost_at_moment: 10.1,
          quantity: 2,
          created_at: new Date('2026-07-01T00:00:00Z'),
          id_inventory_operation: 'op-5c',
          id_product: 'prod-1',
        },
      ],
    };

    expect(isInventoryOperationEntity(value)).toBe(false);
  });

  it('returns false when inventory_operation_descriptions is not an array', () => {
    const value: unknown = {
      id_inventory_operation: 'op-6',
      movement_type: 1,
      created_by: 'user-1',
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      inventory_operation_descriptions: {},
    };

    expect(isInventoryOperationEntity(value)).toBe(false);
  });

  it('returns false when nested descriptions are invalid', () => {
    const value: unknown = {
      id_inventory_operation: 'op-7',
      movement_type: 1,
      created_by: 'user-1',
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      inventory_operation_descriptions: [
        {
          id_inventory_operation_description: 'desc-1',
          price_at_moment: 12.5,
          cost_at_moment: 10.1,
          quantity: '2',
          created_at: new Date('2026-07-01T00:00:00Z'),
          id_inventory_operation: 'op-7',
          id_product: 'prod-1',
        },
      ],
    };

    expect(isInventoryOperationEntity(value)).toBe(false);
  });
});
