import { InventoryAggregate } from '@/src/inventories/core/aggregates/inventory.aggregate';
import { INVENTORY_CONTEXT_ENUM } from '@/src/inventories/core/enums/inventory-context.enum';
import { INVENTORY_STATE_ENUM } from '@/src/inventories/core/enums/inventory-state-enum';
import { STOCK_VALIDATION_ENUM } from '@/src/inventories/core/enums/stock-validation.enum';
import { InventoryBalanceObjectValue } from '@/src/inventories/core/value-objects/inventory-balance.object-value';

import { createInventoryBalance, createInventoryEntity } from '@/test/test-helpers';

describe('InventoryAggregate', () => {
  it('creates a new inventory when context (WAREHOUSE) and assignment are valid (user case)', () => {
    const aggregate = new InventoryAggregate(null);

    const created = aggregate.createNewInventory(
      'inv-new',
      INVENTORY_CONTEXT_ENUM.WAREHOUSE,
      STOCK_VALIDATION_ENUM.ENABLE,
      ' Warehouse A ',
      'user-1',
      'assigned-user-1',
      null,
    );

    expect(created.id_inventory).toBe('inv-new');
    expect(created.inventory_context).toBe(INVENTORY_CONTEXT_ENUM.WAREHOUSE);
    expect(created.is_active).toBe(INVENTORY_STATE_ENUM.ACTIVE);
    expect(created.assigned_to).toBe('assigned-user-1');
  });

  it('creates a new inventory when context (AVAILABLE_FOR_SALE) and assignment (facility case) are valid (user case)', () => {
    const aggregate = new InventoryAggregate(null);

    const created = aggregate.createNewInventory(
      'inv-new',
      INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE,
      STOCK_VALIDATION_ENUM.ENABLE,
      ' Warehouse A ',
      'user-1',
      null,
      'assigned-facility-1',
    );

    expect(created.id_inventory).toBe('inv-new');
    expect(created.inventory_context).toBe(INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE);
    expect(created.is_active).toBe(INVENTORY_STATE_ENUM.ACTIVE);
    expect(created.assigned_facility).toBe('assigned-facility-1');
  });

  it('throws when creating inventory with invalid context type', () => {
    const aggregate = new InventoryAggregate(null);

    expect(() =>
      aggregate.createNewInventory(
        'inv-new',
        'invalid' as unknown as INVENTORY_CONTEXT_ENUM,
        STOCK_VALIDATION_ENUM.ENABLE,
        'Inventory',
        'user-1',
        'assigned-user-1',
        null
      ),
    ).toThrow('You are trying to create an inventory in a context that does not exist.');
  });

  it('throws when creating a forbidden inventory context: CLIENT_VIRTUAL', () => {
    const aggregate = new InventoryAggregate(null);

    expect(() =>
      aggregate.createNewInventory(
        'inv-new',
        INVENTORY_CONTEXT_ENUM.CLIENT_VIRTUAL,
        STOCK_VALIDATION_ENUM.ENABLE,
        'Inventory',
        'user-1',
        'assigned-user-1',
        null
      ),
    ).toThrow('You are trying to create an inventory of a forbbiden type.');
  });

  it('throws when creating a forbidden inventory context: WASTED_VIRTUAL', () => {
    const aggregate = new InventoryAggregate(null);

    expect(() =>
      aggregate.createNewInventory(
        'inv-new',
        INVENTORY_CONTEXT_ENUM.WASTED_VIRTUAL,
        STOCK_VALIDATION_ENUM.ENABLE,
        'Inventory',
        'user-1',
        'assigned-user-1',
        null,
      ),
    ).toThrow('You are trying to create an inventory of a forbbiden type.');
  });

  it('throws when creating a forbidden inventory context: INVENTORY_SUPPLIER_VIRTUAL', () => {
    const aggregate = new InventoryAggregate(null);

    expect(() =>
      aggregate.createNewInventory(
        'inv-new',
        INVENTORY_CONTEXT_ENUM.INVENTORY_SUPPLIER_VIRTUAL,
        STOCK_VALIDATION_ENUM.ENABLE,
        'Inventory',
        'user-1',
        'assigned-user-1',
        null,
      ),
    ).toThrow('You are trying to create an inventory of a forbbiden type.');
  });
  
  it('throws when creating a forbidden inventory context: ADJUSTMENT_VIRTUAL', () => {
    const aggregate = new InventoryAggregate(null);

    expect(() =>
      aggregate.createNewInventory(
        'inv-new',
        INVENTORY_CONTEXT_ENUM.ADJUSTMENT_VIRTUAL,
        STOCK_VALIDATION_ENUM.ENABLE,
        'Inventory',
        'user-1',
        'assigned-user-1',
        null,
      ),
    ).toThrow('You are trying to create an inventory of a forbbiden type.');
  });

  it('throws when creating inventory without assigned user and facility', () => {
    const aggregate = new InventoryAggregate(null);

    expect(() =>
      aggregate.createNewInventory(
        'inv-new',
        INVENTORY_CONTEXT_ENUM.WAREHOUSE,
        STOCK_VALIDATION_ENUM.ENABLE,
        'Inventory',
        'user-1',
        null,
        null
      ),
    ).toThrow('For creating a new inventory, you have to assign to the inventory at least an user or a facility.');
  });

  it('throws when creating inventory with blank name', () => {
    const aggregate = new InventoryAggregate(null);

    expect(() =>
      aggregate.createNewInventory(
        'inv-new',
        INVENTORY_CONTEXT_ENUM.WAREHOUSE,
        STOCK_VALIDATION_ENUM.ENABLE,
        '   ',
        'user-1',
        'assigned-user-1',
        null
      ),
    ).toThrow('Inventory name cannot be empty or only spaces.');
  });

  it('deactivates and reactivates a regular inventory', () => {
    const aggregate = new InventoryAggregate(
      createInventoryEntity({
        id_inventory: 'inv-1',
        inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE,
      }),
    );

    const deactivated = aggregate.deactivateInventory();
    const reactivated = aggregate.reactivateInventory();

    expect(deactivated.is_active).toBe(INVENTORY_STATE_ENUM.DEACTIVE);
    expect(reactivated.is_active).toBe(INVENTORY_STATE_ENUM.ACTIVE);
  });

  it('throws when deactivating a forbidden inventory', () => {
    const aggregate = new InventoryAggregate(
      createInventoryEntity({
        id_inventory: 'inv-client',
        inventory_context: INVENTORY_CONTEXT_ENUM.CLIENT_VIRTUAL,
      }),
    );

    expect(() => aggregate.deactivateInventory()).toThrow(
      "You cannot deactivate the inventory with the id: inv-client because it's an special inventory.",
    );
  });

  it('updates inventory name', () => {
    const aggregate = new InventoryAggregate(
      createInventoryEntity({
        id_inventory: 'inv-1',
        inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE,
        inventory_name: 'Old Name',
        stock_validation: STOCK_VALIDATION_ENUM.ENABLE,
      }),
    );

    const updated = aggregate.updateInventory('  New Name  ', undefined);

    expect(updated.inventory_name).toBe('New Name');
    expect(updated.stock_validation).toBe(STOCK_VALIDATION_ENUM.ENABLE);
  });

  it('updates inventory stock validation state. From enable to disable', () => {
    const aggregate = new InventoryAggregate(
      createInventoryEntity({
        id_inventory: 'inv-1',
        inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE,
        inventory_name: 'Old Name',
        stock_validation: STOCK_VALIDATION_ENUM.ENABLE,
      }),
    );

    const updated = aggregate.updateInventory(undefined, STOCK_VALIDATION_ENUM.DISABLE);

    expect(updated.inventory_name).toBe('Old Name');
    expect(updated.stock_validation).toBe(STOCK_VALIDATION_ENUM.DISABLE);
  });

  it('updates inventory stock validation state. From disable to enable', () => {
    const aggregate = new InventoryAggregate(
      createInventoryEntity({
        id_inventory: 'inv-1',
        inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE,
        inventory_name: 'Old Name',
        stock_validation: STOCK_VALIDATION_ENUM.DISABLE,
      }),
    );

    const updated = aggregate.updateInventory(undefined, STOCK_VALIDATION_ENUM.ENABLE);

    expect(updated.inventory_name).toBe('Old Name');
    expect(updated.stock_validation).toBe(STOCK_VALIDATION_ENUM.ENABLE);
  });

  it('updates name with spaces.', () => {
    const aggregate = new InventoryAggregate(
      createInventoryEntity({
        id_inventory: 'inv-1',
        inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE,
        inventory_name: 'Old Name',
        stock_validation: STOCK_VALIDATION_ENUM.ENABLE,
      }),
    );

    const updated = aggregate.updateInventory(' New name ');

    expect(updated.inventory_name).toBe('New name');
    expect(updated.stock_validation).toBe(STOCK_VALIDATION_ENUM.ENABLE);
  });

  it('throws when updating a deactivated inventory', () => {
    const aggregate = new InventoryAggregate(
      createInventoryEntity({
        id_inventory: 'inv-1',
        is_active: INVENTORY_STATE_ENUM.DEACTIVE,
      }),
    );

    expect(() => aggregate.updateInventory('Name')).toThrow(
      'You cannot perform this operation because the inventory (inv-1) is deactivated.',
    );
  });

  it('establishes limits for existing product and returns affected balance', () => {
    const aggregate = new InventoryAggregate(
      createInventoryEntity({
        id_inventory: 'inv-1',
        inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE,
        inventory_balance: [createInventoryBalance({ id_product: 'prod-1', quantity: 7, id_inventory: 'inv-1' })],
      }),
    );

    aggregate.establishLimitsForInventoryBalance('prod-1', 2, 10, 'new-balance-id');

    const affected = aggregate.getAffectedInventoryBalance();
    expect(affected).toHaveLength(1);
    expect(affected[0].id_product).toBe('prod-1');
    expect(affected[0].min_quantity).toBe(2);
    expect(affected[0].max_quantity).toBe(10);
  });

  it('adds new product balance when setting limits for missing product', () => {
    const aggregate = new InventoryAggregate(
      createInventoryEntity({ id_inventory: 'inv-1', inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE }),
    );

    aggregate.establishLimitsForInventoryBalance('prod-2', 1, 5, 'new-balance-id');

    const affected = aggregate.getAffectedInventoryBalance();
    expect(affected).toHaveLength(1);
    expect(affected[0]).toBeInstanceOf(InventoryBalanceObjectValue);
    expect(affected[0].id_inventory_balance).toBe('new-balance-id');
    expect(affected[0].quantity).toBe(0);
  });

  it('preserves existing balance id and quantity when updating limits for an existing product', () => {
    const aggregate = new InventoryAggregate(
      createInventoryEntity({
        id_inventory: 'inv-1',
        inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE,
        inventory_balance: [
          createInventoryBalance({
            id_inventory_balance: 'existing-balance-id',
            id_product: 'prod-1',
            quantity: 99,
            id_inventory: 'inv-1',
          }),
        ],
      }),
    );

    aggregate.establishLimitsForInventoryBalance('prod-1', 4, 40, 'new-balance-id-ignored');

    const affected = aggregate.getAffectedInventoryBalance();
    expect(affected).toHaveLength(1);
    expect(affected[0].id_inventory_balance).toBe('existing-balance-id');
    expect(affected[0].quantity).toBe(99);
    expect(affected[0].min_quantity).toBe(4);
    expect(affected[0].max_quantity).toBe(40);
  });

  it('tracks an affected product only once when limits are updated multiple times', () => {
    const aggregate = new InventoryAggregate(
      createInventoryEntity({ id_inventory: 'inv-1', inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE }),
    );

    aggregate.establishLimitsForInventoryBalance('prod-2', 1, 5, 'new-balance-id');
    aggregate.establishLimitsForInventoryBalance('prod-2', 2, 10, 'ignored-id');

    const affected = aggregate.getAffectedInventoryBalance();
    expect(affected).toHaveLength(1);
    expect(affected[0].id_product).toBe('prod-2');
    expect(affected[0].min_quantity).toBe(2);
    expect(affected[0].max_quantity).toBe(10);
  });

  it('throws when establishing limits without an initialized inventory', () => {
    const aggregate = new InventoryAggregate(null);

    expect(() => aggregate.establishLimitsForInventoryBalance('prod-1', 1, 10, 'new-balance-id')).toThrow(
      'The inventory has not been initialized.',
    );
  });

  it('throws when establishing limits for a forbidden inventory context', () => {
    const aggregate = new InventoryAggregate(
      createInventoryEntity({
        id_inventory: 'inv-client',
        inventory_context: INVENTORY_CONTEXT_ENUM.CLIENT_VIRTUAL,
      }),
    );

    expect(() => aggregate.establishLimitsForInventoryBalance('prod-1', 1, 10, 'new-balance-id')).toThrow(
      "You cannot update the inventory with the id: inv-client because it's an special inventory.",
    );
  });

  it('throws when constructor receives duplicate product balance entries', () => {
    const repeatedProduct = [
      createInventoryBalance({ id_inventory_balance: 'b1', id_product: 'prod-1', id_inventory: 'inv-1' }),
      createInventoryBalance({ id_inventory_balance: 'b2', id_product: 'prod-1', id_inventory: 'inv-1' }),
    ];

    expect(
      () =>
        new InventoryAggregate(
          createInventoryEntity({
            id_inventory: 'inv-1',
            inventory_balance: repeatedProduct,
          }),
        ),
    ).toThrow('The product with id prod-1 appears twice in inventory with id inv-1');
  });
});