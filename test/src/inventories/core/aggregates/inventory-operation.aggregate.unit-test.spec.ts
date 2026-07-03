import { InventoryOperationAggregate } from '@/src/inventories/core/aggregates/inventory-operation.aggregate';
import { INVENTORY_CONTEXT_ENUM } from '@/src/inventories/core/enums/inventory-context.enum';
import { INVENTORY_STATE_ENUM } from '@/src/inventories/core/enums/inventory-state-enum';
import { MOVEMENT_TYPE_ENUM } from '@/src/inventories/core/enums/movement-type.enum';
import { STOCK_VALIDATION_ENUM } from '@/src/inventories/core/enums/stock-validation.enum';

import {
  createInventoryBalance,
  createInventoryEntity,
  createInventoryOperationEntity,
} from '@/test/src/inventories/application/test-helpers';

describe('InventoryOperationAggregate', () => {
  const now = new Date('2026-07-03T00:00:00.000Z');

  function createAggregate(
    originOverrides: Parameters<typeof createInventoryEntity>[0] = {},
    targetOverrides: Parameters<typeof createInventoryEntity>[0] = {},
  ): InventoryOperationAggregate {
    const origin = createInventoryEntity({
      id_inventory: 'inv-origin',
      inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE,
      stock_validation: STOCK_VALIDATION_ENUM.ENABLE,
      inventory_balance: [
        createInventoryBalance({
          id_inventory_balance: 'balance-origin',
          id_inventory: 'inv-origin',
          id_product: 'prod-1',
          quantity: 8,
        }),
      ],
      ...originOverrides,
    });
    const target = createInventoryEntity({
      id_inventory: 'inv-target',
      inventory_context: INVENTORY_CONTEXT_ENUM.PRODUCT_RESERVATION,
      stock_validation: STOCK_VALIDATION_ENUM.ENABLE,
      inventory_balance: [
        createInventoryBalance({
          id_inventory_balance: 'balance-target',
          id_inventory: 'inv-target',
          id_product: 'prod-1',
          quantity: 2,
        }),
      ],
      ...targetOverrides,
    });

    return new InventoryOperationAggregate(origin, target);
  }

  it('creates an internal movement when origin and target contexts are allowed', () => {
    const aggregate = createAggregate();

    aggregate.createInternalInventoryOperation('operation-1', 'user-1', now, '10.1', '20.2');

    const operation = aggregate.getInventoryOperation();
    expect(operation.id_inventory_operation).toBe('operation-1');
    expect(operation.movement_type).toBe(MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT);
    expect(operation.id_inventory_origin).toBe('inv-origin');
    expect(operation.id_inventory_target).toBe('inv-target');
  });

  it('throws when creating internal movement to the same inventory', () => {
    const aggregate = createAggregate({ id_inventory: 'same-id' }, { id_inventory: 'same-id' });

    expect(() =>
      aggregate.createInternalInventoryOperation('operation-1', 'user-1', now, null, null),
    ).toThrow('You cannot perform an inventory operation to the same inventory operation.');
  });

  it('throws when origin inventory in operation is deactivated', () => {
    const aggregate = createAggregate(
      { is_active: INVENTORY_STATE_ENUM.DEACTIVE },
      { is_active: INVENTORY_STATE_ENUM.ACTIVE },
    );

    expect(() =>
      aggregate.createInternalInventoryOperation('operation-1', 'user-1', now, null, null),
    ).toThrow('is deactive.');
  });

  it('throws when target inventory in operation is deactivated', () => {
    const aggregate = createAggregate(
      { is_active: INVENTORY_STATE_ENUM.ACTIVE },
      { is_active: INVENTORY_STATE_ENUM.DEACTIVE },
    );

    expect(() =>
      aggregate.createInternalInventoryOperation('operation-1', 'user-1', now, null, null),
    ).toThrow('is deactive.');
  });

  it('throws when creating transaction operation with invalid movement type', () => {
    const aggregate = createAggregate(
      { inventory_context: INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE },
      { inventory_context: INVENTORY_CONTEXT_ENUM.CLIENT_VIRTUAL, inventory_balance: [] },
    );

    expect(() =>
      aggregate.createInventoryOperationForTransaction(
        'operation-1',
        MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT,
        'user-1',
        now,
        'doc-1',
        null,
        null,
      ),
    ).toThrow('invalid movement type');
  });

  it('creates transaction operation when contexts and document reference are valid', () => {
    const aggregate = createAggregate(
      {
        inventory_context: INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE,
        inventory_balance: [
          createInventoryBalance({
            id_inventory_balance: 'balance-origin',
            id_inventory: 'inv-origin',
            id_product: 'prod-1',
            quantity: 10,
          }),
        ],
      },
      {
        inventory_context: INVENTORY_CONTEXT_ENUM.CLIENT_VIRTUAL,
        inventory_balance: [],
      },
    );

    aggregate.createInventoryOperationForTransaction(
      'operation-1',
      MOVEMENT_TYPE_ENUM.SELLING,
      'user-1',
      now,
      'doc-1',
      '10.1',
      '20.2',
    );

    const operation = aggregate.getInventoryOperation();
    expect(operation.movement_type).toBe(MOVEMENT_TYPE_ENUM.SELLING);
    expect(operation.document_reference).toBe('doc-1');
  });

  it('creates adjustment operation when target is adjustment virtual', () => {
    const aggregate = createAggregate(
      { inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE },
      { inventory_context: INVENTORY_CONTEXT_ENUM.ADJUSTMENT_VIRTUAL, inventory_balance: [] },
    );

    aggregate.createAdjustmentOperation('operation-1', 'user-1', now, null, null);

    expect(aggregate.getInventoryOperation().movement_type).toBe(MOVEMENT_TYPE_ENUM.ADJUSTMENT);
  });

  it('throws when adjustment target is not adjustment virtual', () => {
    const aggregate = createAggregate(
      { inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE },
      { inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE },
    );

    expect(() => aggregate.createAdjustmentOperation('operation-1', 'user-1', now, null, null)).toThrow(
      'it must be ADJUSTMENT_VIRTUAL.',
    );
  });

  it('throws when adding operation description before operation initialization', () => {
    const aggregate = createAggregate();

    expect(() =>
      aggregate.addInventoryOperationDescription(
        'desc-1',
        12.5,
        10,
        1,
        'prod-1',
        'new-origin-balance',
        'new-target-balance',
        now,
      ),
    ).toThrow('it has not been initialized.');
  });

  it('throws on duplicate product descriptions for same operation', () => {
    const aggregate = createAggregate();

    aggregate.createInternalInventoryOperation('operation-1', 'user-1', now, null, null);
    aggregate.addInventoryOperationDescription(
      'desc-1',
      12.5,
      10,
      1,
      'prod-1',
      'new-origin-balance',
      'new-target-balance',
      now,
    );

    expect(() =>
      aggregate.addInventoryOperationDescription(
        'desc-2',
        12.5,
        10,
        1,
        'prod-1',
        'new-origin-balance-2',
        'new-target-balance-2',
        now,
      ),
    ).toThrow('same id product');
  });

  it('throws when quantity is negative for non-adjustment/non-reversed operation', () => {
    const aggregate = createAggregate();

    aggregate.createInternalInventoryOperation('operation-1', 'user-1', now, null, null);

    expect(() =>
      aggregate.addInventoryOperationDescription(
        'desc-1',
        12.5,
        10,
        -1,
        'prod-1',
        'new-origin-balance',
        'new-target-balance',
        now,
      ),
    ).toThrow('Negative inventory operation description is not allowed');
  });

  it('updates balances and exposes affected records for non-special inventories', () => {
    const aggregate = createAggregate(
      {
        inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE,
        inventory_balance: [
          createInventoryBalance({
            id_inventory_balance: 'balance-origin',
            id_inventory: 'inv-origin',
            id_product: 'prod-1',
            quantity: 8,
          }),
        ],
      },
      {
        inventory_context: INVENTORY_CONTEXT_ENUM.PRODUCT_RESERVATION,
        inventory_balance: [
          createInventoryBalance({
            id_inventory_balance: 'balance-target',
            id_inventory: 'inv-target',
            id_product: 'prod-1',
            quantity: 2,
          }),
        ],
      },
    );

    aggregate.createInternalInventoryOperation('operation-1', 'user-1', now, null, null);
    aggregate.addInventoryOperationDescription(
      'desc-1',
      12.5,
      10,
      3,
      'prod-1',
      'new-origin-balance',
      'new-target-balance',
      now,
    );

    const affected = aggregate.getAffectedInventoryBalanceRecords();
    expect(affected).toHaveLength(2);

    const originRecord = affected.find((record) => record.id_inventory === 'inv-origin');
    const targetRecord = affected.find((record) => record.id_inventory === 'inv-target');

    expect(originRecord?.quantity).toBe(5);
    expect(targetRecord?.quantity).toBe(5);
  });

  it('allows negative quantity in reversed operation', () => {
    const aggregate = createAggregate();
    const sourceOperation = createInventoryOperationEntity({
      id_inventory_operation: 'source-op',
      movement_type: MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT,
    });

    aggregate.reverseInventoryOperation('reverse-op', 'user-1', now, sourceOperation, null, null);
    aggregate.addInventoryOperationDescription(
      'desc-1',
      12.5,
      10,
      -2,
      'prod-1',
      'new-origin-balance',
      'new-target-balance',
      now,
    );

    expect(aggregate.getInventoryOperation().movement_type).toBe(MOVEMENT_TYPE_ENUM.REVERSED);
  });

  it('throws when trying to reverse an already reversed operation', () => {
    const aggregate = createAggregate();
    const sourceOperation = createInventoryOperationEntity({
      id_inventory_operation: 'source-op',
      movement_type: MOVEMENT_TYPE_ENUM.REVERSED,
    });

    expect(() =>
      aggregate.reverseInventoryOperation('reverse-op', 'user-1', now, sourceOperation, null, null),
    ).toThrow('cannot be reversed');
  });
});
