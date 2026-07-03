import { EntityModelMapper } from '@/src/inventories/application/mappers/entity-model.mapper';

import { INVENTORY_CONTEXT_ENUM } from '@/src/inventories/core/enums/inventory-context.enum';
import { INVENTORY_STATE_ENUM } from '@/src/inventories/core/enums/inventory-state-enum';
import { STOCK_VALIDATION_ENUM } from '@/src/inventories/core/enums/stock-validation.enum';
import { MOVEMENT_TYPE_ENUM } from '@/src/inventories/core/enums/movement-type.enum';

import { InventoryEntity } from '@/src/inventories/core/entities/inventory.entity';
import { InventoryOperationEntity } from '@/src/inventories/core/entities/inventory-operation.entity';
import { InventoryBalanceObjectValue } from '@/src/inventories/core/value-objects/inventory-balance.object-value';
import { InventoryOperationDescriptionObjectValue } from '@/src/inventories/core/value-objects/inventory-operation-description.object-value';

describe('EntityModelMapper', () => {
  const mapper = new EntityModelMapper();

  it('toDomainObject maps InventoryBalanceModel to InventoryBalanceObjectValue', () => {
    const model = {
      id_inventory_balance: 'bal-1',
      quantity: 10,
      min_quantity: 1,
      max_quantity: 100,
      created_at: '2026-07-01T00:00:00.000Z',
      updated_at: '2026-07-01T01:00:00.000Z',
      id_inventory: 'inv-1',
      id_product: 'prod-1',
    };

    const result = mapper.toDomainObject(model);

    expect(result).toBeInstanceOf(InventoryBalanceObjectValue);
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('toDomainObject maps InventoryOperationDescriptionModel to InventoryOperationDescriptionObjectValue', () => {
    const model = {
      id_inventory_operation_description: 'desc-1',
      price_at_moment: 12.5,
      cost_at_moment: 10.1,
      quantity: 2,
      created_at: '2026-07-01T00:00:00.000Z',
      id_inventory_operation: 'op-1',
      id_product: 'prod-1',
    };

    const result = mapper.toDomainObject(model);

    expect(result).toBeInstanceOf(InventoryOperationDescriptionObjectValue);
    expect(result.id_inventory_operation_description).toBe('desc-1');
  });

  it('toDomainObject maps InventoryModel with nested balances to InventoryEntity', () => {
    const model = {
      id_inventory: 'inv-1',
      inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE,
      inventory_name: 'Main Warehouse',
      is_active: INVENTORY_STATE_ENUM.ACTIVE,
      stock_validation: STOCK_VALIDATION_ENUM.ENABLE,
      created_at: '2026-07-01T00:00:00.000Z',
      updated_at: '2026-07-01T01:00:00.000Z',
      created_by: 'user-1',
      assigned_to: null,
      assigned_facility: null,
    };

    const nested = [
      {
        id_inventory_balance: 'bal-1',
        quantity: 10,
        min_quantity: 1,
        max_quantity: 100,
        created_at: '2026-07-01T00:00:00.000Z',
        updated_at: '2026-07-01T01:00:00.000Z',
        id_inventory: 'inv-1',
        id_product: 'prod-1',
      },
    ];

    const result = mapper.toDomainObject(model as never, nested as never);

    expect(result).toBeInstanceOf(InventoryEntity);
    expect(result.inventory_balance).toHaveLength(1);
    expect(result.inventory_balance[0]).toBeInstanceOf(InventoryBalanceObjectValue);
  });

  it('toDomainObject throws when InventoryModel does not include nested balance models', () => {
    const model = {
      id_inventory: 'inv-1',
      inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE,
      inventory_name: 'Main Warehouse',
      is_active: INVENTORY_STATE_ENUM.ACTIVE,
      stock_validation: STOCK_VALIDATION_ENUM.ENABLE,
      created_at: '2026-07-01T00:00:00.000Z',
      updated_at: '2026-07-01T01:00:00.000Z',
      created_by: 'user-1',
      assigned_to: null,
      assigned_facility: null,
    };

    expect(() => mapper.toDomainObject(model as never)).toThrow(
      'Missing inventory balance models for InventoryModel to domain object conversion',
    );
  });

  it('toDomainObject throws when InventoryModel includes invalid nested balance models', () => {
    const model = {
      id_inventory: 'inv-1',
      inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE,
      inventory_name: 'Main Warehouse',
      is_active: INVENTORY_STATE_ENUM.ACTIVE,
      stock_validation: STOCK_VALIDATION_ENUM.ENABLE,
      created_at: '2026-07-01T00:00:00.000Z',
      updated_at: '2026-07-01T01:00:00.000Z',
      created_by: 'user-1',
      assigned_to: null,
      assigned_facility: null,
    };

    const nested = [
      {
        invalid: true,
      },
    ];

    expect(() => mapper.toDomainObject(model as never, nested as never)).toThrow(
      'Invalid balance model at moment of transforming inventory model to domain object',
    );
  });

  it('toDomainObject throws when InventoryModel has invalid inventory_context', () => {
    const model = {
      id_inventory: 'inv-1',
      inventory_context: 999,
      inventory_name: 'Main Warehouse',
      is_active: INVENTORY_STATE_ENUM.ACTIVE,
      stock_validation: STOCK_VALIDATION_ENUM.ENABLE,
      created_at: '2026-07-01T00:00:00.000Z',
      updated_at: '2026-07-01T01:00:00.000Z',
      created_by: 'user-1',
      assigned_to: null,
      assigned_facility: null,
    };

    const nested = [
      {
        id_inventory_balance: 'bal-1',
        quantity: 10,
        min_quantity: 1,
        max_quantity: 100,
        created_at: '2026-07-01T00:00:00.000Z',
        updated_at: '2026-07-01T01:00:00.000Z',
        id_inventory: 'inv-1',
        id_product: 'prod-1',
      },
    ];

    expect(() => mapper.toDomainObject(model as never, nested as never)).toThrow(
      'Error at moment of transforming inventory model. Invalid inventory context.',
    );
  });

  it('toDomainObject throws when InventoryModel has invalid is_active', () => {
    const model = {
      id_inventory: 'inv-1',
      inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE,
      inventory_name: 'Main Warehouse',
      is_active: 999,
      stock_validation: STOCK_VALIDATION_ENUM.ENABLE,
      created_at: '2026-07-01T00:00:00.000Z',
      updated_at: '2026-07-01T01:00:00.000Z',
      created_by: 'user-1',
      assigned_to: null,
      assigned_facility: null,
    };

    const nested = [
      {
        id_inventory_balance: 'bal-1',
        quantity: 10,
        min_quantity: 1,
        max_quantity: 100,
        created_at: '2026-07-01T00:00:00.000Z',
        updated_at: '2026-07-01T01:00:00.000Z',
        id_inventory: 'inv-1',
        id_product: 'prod-1',
      },
    ];

    expect(() => mapper.toDomainObject(model as never, nested as never)).toThrow(
      'Error at moment of transforming inventory model. Invalid inventory state.',
    );
  });

  it('toDomainObject throws when InventoryModel has invalid stock validation', () => {
    const model = {
      id_inventory: 'inv-1',
      inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE,
      inventory_name: 'Main Warehouse',
      is_active: INVENTORY_STATE_ENUM.ACTIVE,
      stock_validation: 99,
      created_at: '2026-07-01T00:00:00.000Z',
      updated_at: '2026-07-01T01:00:00.000Z',
      created_by: 'user-1',
      assigned_to: null,
      assigned_facility: null,
    };

    const nested = [
      {
        id_inventory_balance: 'bal-1',
        quantity: 10,
        min_quantity: 1,
        max_quantity: 100,
        created_at: '2026-07-01T00:00:00.000Z',
        updated_at: '2026-07-01T01:00:00.000Z',
        id_inventory: 'inv-1',
        id_product: 'prod-1',
      },
    ];

    expect(() => mapper.toDomainObject(model as never, nested as never)).toThrow(
      'Error at moment of transforming inventory model. Invalid stock validatio state.',
    );
  });

  it('toDomainObject throws when InventoryModel has invalid created_at format', () => {
    const model = {
      id_inventory: 'inv-1',
      inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE,
      inventory_name: 'Main Warehouse',
      is_active: INVENTORY_STATE_ENUM.ACTIVE,
      stock_validation: STOCK_VALIDATION_ENUM.ENABLE,
      created_at: 'Invalid format',
      updated_at: '2026-07-01T01:00:00.000Z',
      created_by: 'user-1',
      assigned_to: null,
      assigned_facility: null,
    };

    const nested = [
      {
        id_inventory_balance: 'bal-1',
        quantity: 10,
        min_quantity: 1,
        max_quantity: 100,
        created_at: '2026-07-01T00:00:00.000Z',
        updated_at: '2026-07-01T01:00:00.000Z',
        id_inventory: 'inv-1',
        id_product: 'prod-1',
      },
    ];

    expect(() => mapper.toDomainObject(model as never, nested as never)).toThrow(
      'Invalid InventoryModel.created_at format',
    );
  });

  it('toDomainObject throws when InventoryModel has invalid updated_at format', () => {
    const model = {
      id_inventory: 'inv-1',
      inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE,
      inventory_name: 'Main Warehouse',
      is_active: INVENTORY_STATE_ENUM.ACTIVE,
      stock_validation: STOCK_VALIDATION_ENUM.ENABLE,
      created_at: '2026-07-01T00:00:00.000Z',
      updated_at: 'invalid-date',
      created_by: 'user-1',
      assigned_to: null,
      assigned_facility: null,
    };

    const nested = [
      {
        id_inventory_balance: 'bal-1',
        quantity: 10,
        min_quantity: 1,
        max_quantity: 100,
        created_at: '2026-07-01T00:00:00.000Z',
        updated_at: '2026-07-01T01:00:00.000Z',
        id_inventory: 'inv-1',
        id_product: 'prod-1',
      },
    ];

    expect(() => mapper.toDomainObject(model as never, nested as never)).toThrow(
      'Invalid InventoryModel.updated_at format',
    );
  });

  it('toDomainObject maps InventoryOperationModel with nested descriptions to InventoryOperationEntity', () => {
    const model = {
      id_inventory_operation: 'op-1',
      movement_type: MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT,
      created_at: '2026-07-01T00:00:00.000Z',
      created_by: 'user-1',
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      latitude: null,
      longitude: null,
      inventory_operation_reference: null,
      document_reference: null,
    };

    const nested = [
      {
        id_inventory_operation_description: 'desc-1',
        price_at_moment: 12.5,
        cost_at_moment: 10.1,
        quantity: 2,
        created_at: '2026-07-01T00:00:00.000Z',
        id_inventory_operation: 'op-1',
        id_product: 'prod-1',
      },
    ];

    const result:InventoryOperationEntity = mapper.toDomainObject(model as never, nested as never);

    expect(result).toBeInstanceOf(InventoryOperationEntity);
    expect(result.inventory_operation_descriptions).toHaveLength(1);
    expect(result.inventory_operation_descriptions[0]).toBeInstanceOf(
      InventoryOperationDescriptionObjectValue,
    );
  });

  it('toDomainObject throws when InventoryOperationModel has invalid movement_type', () => {
    const model = {
      id_inventory_operation: 'op-1',
      movement_type: 999,
      created_at: '2026-07-01T00:00:00.000Z',
      created_by: 'user-1',
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      latitude: null,
      longitude: null,
      inventory_operation_reference: null,
      document_reference: null,
    };

    const nested = [
      {
        id_inventory_operation_description: 'desc-1',
        price_at_moment: 12.5,
        cost_at_moment: 10.1,
        quantity: 2,
        created_at: '2026-07-01T00:00:00.000Z',
        id_inventory_operation: 'op-1',
        id_product: 'prod-1',
      },
    ];

    expect(() => mapper.toDomainObject(model as never, nested as never)).toThrow(
      'Invalid movement_type in InventoryOperationModel',
    );
  });

  it('toDomainObject throws when InventoryOperationModel does not include nested description models', () => {
    const model = {
      id_inventory_operation: 'op-1',
      movement_type: MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT,
      created_at: '2026-07-01T00:00:00.000Z',
      created_by: 'user-1',
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      latitude: null,
      longitude: null,
      inventory_operation_reference: null,
      document_reference: null,
    };

    expect(() => mapper.toDomainObject(model as never)).toThrow(
      'Missing inventory operation description models for InventoryOperationModel to domain object conversion',
    );
  });

  it('toDomainObject throws when InventoryOperationModel includes invalid nested description models', () => {
    const model = {
      id_inventory_operation: 'op-1',
      movement_type: MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT,
      created_at: '2026-07-01T00:00:00.000Z',
      created_by: 'user-1',
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      latitude: null,
      longitude: null,
      inventory_operation_reference: null,
      document_reference: null,
    };

    const nested = [
      {
        invalid: true,
      },
    ];

    expect(() => mapper.toDomainObject(model as never, nested as never)).toThrow(
      'Missing inventory operation description models for InventoryOperationModel to domain object conversion',
    );
  });

  it('toDomainObject throws when InventoryOperationModel has invalid created_at format', () => {
    const model = {
      id_inventory_operation: 'op-1',
      movement_type: MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT,
      created_at: 'invalid-date',
      created_by: 'user-1',
      id_inventory_origin: 'inv-origin',
      id_inventory_target: 'inv-target',
      latitude: null,
      longitude: null,
      inventory_operation_reference: null,
      document_reference: null,
    };

    const nested = [
      {
        id_inventory_operation_description: 'desc-1',
        price_at_moment: 12.5,
        cost_at_moment: 10.1,
        quantity: 2,
        created_at: '2026-07-01T00:00:00.000Z',
        id_inventory_operation: 'op-1',
        id_product: 'prod-1',
      },
    ];

    expect(() => mapper.toDomainObject(model as never, nested as never)).toThrow(
      'Invalid InventoryOperationModel.created_at format',
    );
  });

  it('toDomainObject throws when InventoryOperationDescriptionModel has invalid created_at format', () => {
    const model = {
      id_inventory_operation_description: 'desc-1',
      price_at_moment: 12.5,
      cost_at_moment: 10.1,
      quantity: 2,
      created_at: 'invalid-date',
      id_inventory_operation: 'op-1',
      id_product: 'prod-1',
    };

    expect(() => mapper.toDomainObject(model as never)).toThrow(
      'Invalid InventoryOperationDescriptionModel.created_at format',
    );
  });

  it('toModel maps InventoryEntity to InventoryModel', () => {
    const entity = new InventoryEntity(
      'inv-1',
      INVENTORY_CONTEXT_ENUM.WAREHOUSE,
      'Main Warehouse',
      INVENTORY_STATE_ENUM.ACTIVE,
      STOCK_VALIDATION_ENUM.ENABLE,
      new Date('2026-07-01T00:00:00.000Z'),
      new Date('2026-07-01T01:00:00.000Z'),
      'user-1',
      [],
      null,
      null,
    );

    const result = mapper.toModel(entity);

    expect(result.id_inventory).toBe('inv-1');
    expect(result.created_at).toBe('2026-07-01T00:00:00.000Z');
  });

  it('toModel maps InventoryOperationEntity to InventoryOperationModel', () => {
    const entity = new InventoryOperationEntity(
      'op-1',
      null,
      null,
      MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT,
      new Date('2026-07-01T00:00:00.000Z'),
      'user-1',
      'inv-origin',
      'inv-target',
      [
        new InventoryOperationDescriptionObjectValue(
          'desc-1',
          12.5,
          10.1,
          2,
          new Date('2026-07-01T00:00:00.000Z'),
          'op-1',
          'prod-1',
        ),
      ],
      null,
      null,
    );

    const result = mapper.toModel(entity);

    expect(result.id_inventory_operation).toBe('op-1');
    expect(result.created_at).toBe('2026-07-01T00:00:00.000Z');
    expect(result.inventory_operation_reference).toBeNull();
  });

  it('toModel maps InventoryBalanceObjectValue to InventoryBalanceModel', () => {
    const domainObject = new InventoryBalanceObjectValue(
      'bal-1',
      10,
      1,
      100,
      new Date('2026-07-01T00:00:00.000Z'),
      new Date('2026-07-01T01:00:00.000Z'),
      'inv-1',
      'prod-1',
    );

    const result = mapper.toModel(domainObject);

    expect(result.id_inventory_balance).toBe('bal-1');
    expect(result.updated_at).toBe('2026-07-01T01:00:00.000Z');
  });

  it('toModel maps InventoryOperationDescriptionObjectValue to InventoryOperationDescriptionModel', () => {
    const domainObject = new InventoryOperationDescriptionObjectValue(
      'desc-1',
      12.5,
      10.1,
      2,
      new Date('2026-07-01T00:00:00.000Z'),
      'op-1',
      'prod-1',
    );

    const result = mapper.toModel(domainObject);

    expect(result.id_inventory_operation_description).toBe('desc-1');
    expect(result.created_at).toBe('2026-07-01T00:00:00.000Z');
  });

  it('toDomainObject throws when input does not match any supported model', () => {
    expect(() => mapper.toDomainObject({ invalid: true } as never)).toThrow(
      'Invalid input for mapping to domain object',
    );
  });

  it('toModel throws when input does not match any supported domain object', () => {
    expect(() => mapper.toModel({ invalid: true } as never)).toThrow(
      'Invalid input for mapping to model',
    );
  });

  it('toDomainObject throws when InventoryBalanceModel has invalid created_at format', () => {
    const model = {
      id_inventory_balance: 'bal-1',
      quantity: 10,
      min_quantity: 1,
      max_quantity: 100,
      created_at: 'invalid-date',
      updated_at: '2026-07-01T01:00:00.000Z',
      id_inventory: 'inv-1',
      id_product: 'prod-1',
    };

    expect(() => mapper.toDomainObject(model)).toThrow(
      'Invalid InventoryBalanceModel.created_at format',
    );
  });

  it('toDomainObject throws when InventoryBalanceModel has invalid updated_at format', () => {
    const model = {
      id_inventory_balance: 'bal-1',
      quantity: 10,
      min_quantity: 1,
      max_quantity: 100,
      created_at: '2026-07-01T00:00:00.000Z',
      updated_at: 'invalid-date',
      id_inventory: 'inv-1',
      id_product: 'prod-1',
    };

    expect(() => mapper.toDomainObject(model)).toThrow(
      'Invalid InventoryBalanceModel.updated_at format',
    );
  });
});
