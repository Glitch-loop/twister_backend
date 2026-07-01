import { isInventoryOperationDto } from '@/src/inventories/application/guards/dtos/inventory-operation.guard';

describe('isInventoryOperationDto', () => {
  it('returns true for a valid inventory operation dto', () => {
    const value: unknown = {
      id_inventory_operation: 'op-1',
      movement_type: 1,
      created_at: '2026-07-01T00:00:00Z',
      created_by: 'user-1',
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      inventory_operation_descriptions: [
        {
          id_inventory_operation_description: 'desc-1',
          price_at_moment: 12.5,
          cost_at_moment: 10.1,
          quantity: 2,
          created_at: '2026-07-01T00:00:00Z',
          id_inventory_operation: 'op-1',
          id_product: 'prod-1',
        },
      ],
      latitude: '10.123',
      longitude: '-20.456',
      inventory_operation_reference: 'reference-1',
      document_reference: 'document-1',
    };

    expect(isInventoryOperationDto(value)).toBe(true);
  });

  it('returns true when undefined fields are undefined', () => {
    const value: unknown = {
      id_inventory_operation: 'op-2',
      movement_type: 1,
      created_at: '2026-07-01T00:00:00Z',
      created_by: 'user-1',
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      inventory_operation_descriptions: [
        {
          id_inventory_operation_description: 'desc-1',
          price_at_moment: 12.5,
          cost_at_moment: 10.1,
          quantity: 2,
          created_at: '2026-07-01T00:00:00Z',
          id_inventory_operation: 'op-2',
          id_product: 'prod-1',
        },
      ],
      latitude: undefined,
      longitude: undefined,
      inventory_operation_reference: undefined,
      document_reference: undefined,
    };

    expect(isInventoryOperationDto(value)).toBe(true);
  });
  
  it('returns true when null fields are nulls', () => {
    const value: unknown = {
      id_inventory_operation: 'op-2',
      movement_type: 1,
      created_at: '2026-07-01T00:00:00Z',
      created_by: 'user-1',
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      inventory_operation_descriptions: [
        {
          id_inventory_operation_description: 'desc-1',
          price_at_moment: 12.5,
          cost_at_moment: 10.1,
          quantity: 2,
          created_at: '2026-07-01T00:00:00Z',
          id_inventory_operation: 'op-2',
          id_product: 'prod-1',
        },
      ],
      latitude: null,
      longitude: null,
      inventory_operation_reference: null,
      document_reference: null,
    };

    expect(isInventoryOperationDto(value)).toBe(true);
  });

  it('returns true when: latitude: null, longitude: undefined, inventory_operation_reference: null, document_reference: undefined', () => {
    const value: unknown = {
      id_inventory_operation: 'op-2',
      movement_type: 1,
      created_at: '2026-07-01T00:00:00Z',
      created_by: 'user-1',
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      inventory_operation_descriptions: [
        {
          id_inventory_operation_description: 'desc-1',
          price_at_moment: 12.5,
          cost_at_moment: 10.1,
          quantity: 2,
          created_at: '2026-07-01T00:00:00Z',
          id_inventory_operation: 'op-2',
          id_product: 'prod-1',
        },
      ],
      latitude: null,
      longitude: undefined,
      inventory_operation_reference: null,
      document_reference: undefined,
    };

    expect(isInventoryOperationDto(value)).toBe(true);
  });

  it('returns true when: latitude: undefined, longitude: null, inventory_operation_reference: undefined, document_reference: null', () => {
    const value: unknown = {
      id_inventory_operation: 'op-2',
      movement_type: 1,
      created_at: '2026-07-01T00:00:00Z',
      created_by: 'user-1',
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      inventory_operation_descriptions: [
        {
          id_inventory_operation_description: 'desc-1',
          price_at_moment: 12.5,
          cost_at_moment: 10.1,
          quantity: 2,
          created_at: '2026-07-01T00:00:00Z',
          id_inventory_operation: 'op-2',
          id_product: 'prod-1',
        },
      ],
      latitude: undefined,
      longitude: null,
      inventory_operation_reference: undefined,
      document_reference: null,
    };

    expect(isInventoryOperationDto(value)).toBe(true);
  });

  it('returns false for non-record values', () => {
    expect(isInventoryOperationDto(null)).toBe(false);
    expect(isInventoryOperationDto('invalid')).toBe(false);
  });

  it('returns false when nested descriptions are invalid', () => {
    const value: unknown = {
      id_inventory_operation: 'op-3',
      movement_type: 1,
      created_at: '2026-07-01T00:00:00Z',
      created_by: 'user-1',
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      inventory_operation_descriptions: [
        {
          id_inventory_operation_description: 'desc-1',
          price_at_moment: 12.5,
          cost_at_moment: 10.1,
          quantity: '2',
          created_at: '2026-07-01T00:00:00Z',
          id_inventory_operation: 'op-3',
          id_product: 'prod-1',
        },
      ],
    };

    expect(isInventoryOperationDto(value)).toBe(false);
  });

  it('returns false when created date is of type date', () => {
    const value: unknown = {
      id_inventory_operation: 'op-3',
      movement_type: 1,
      created_at: new Date(),
      created_by: 'user-1',
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      inventory_operation_descriptions: [
        {
          id_inventory_operation_description: 'desc-1',
          price_at_moment: 12.5,
          cost_at_moment: 10.1,
          quantity: '2',
          created_at: '2026-07-01T00:00:00Z',
          id_inventory_operation: 'op-3',
          id_product: 'prod-1',
        },
      ],
    };

    expect(isInventoryOperationDto(value)).toBe(false);
  });
});
