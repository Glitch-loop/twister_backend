import { InventorySupabaseRepository } from '@/src/inventories/infrastructure/repositories/supabase/inventory-supabase.repository';
import { EntityModelMapper } from '@/src/inventories/application/mappers/entity-model.mapper';
import { SupabaseDataSource } from '@/src/shared/infrastructure/datasources/supabase-data-source';
import {
  createInventoryBalance,
  createInventoryEntity,
  createInventoryOperationDescription,
  createInventoryOperationEntity,
} from '@/test/src/inventories/application/test-helpers';

type QueryResult = {
  data?: unknown;
  error: { message: string } | null;
};

class QueryBuilderMock implements PromiseLike<QueryResult> {
  public readonly select = jest.fn(() => this);
  public readonly insert = jest.fn(() => this);
  public readonly update = jest.fn(() => this);
  public readonly upsert = jest.fn(() => this);
  public readonly eq = jest.fn(() => this);
  public readonly in = jest.fn(() => this);
  public readonly or = jest.fn(() => this);
  public readonly order = jest.fn(() => this);
  public readonly limit = jest.fn(() => this);

  private result: QueryResult = { data: [], error: null };

  setResult(result: QueryResult): this {
    this.result = result;
    return this;
  }

  then<TResult1 = QueryResult, TResult2 = never>(
    onfulfilled?: ((value: QueryResult) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return Promise.resolve(this.result).then(onfulfilled, onrejected);
  }
}

describe('InventorySupabaseRepository', () => {
  let mapper: jest.Mocked<Pick<EntityModelMapper, 'toModel' | 'toDomainObject'>>;
  let supabaseDataSource: jest.Mocked<Pick<SupabaseDataSource, 'getClient'>>;
  let supabaseClient: { from: jest.Mock };
  let repository: InventorySupabaseRepository;
  let tables: Record<string, QueryBuilderMock>;

  const inventoryEntity = createInventoryEntity();
  const inventoryWithoutDescriptions = createInventoryOperationEntity({
    inventory_operation_descriptions: [],
  });
  const inventoryOperationEntity = createInventoryOperationEntity();
  const inventoryBalance = createInventoryBalance();

  const inventoryModel = {
    id_inventory: 'inv-1',
    inventory_context: inventoryEntity.inventory_context,
    inventory_name: inventoryEntity.inventory_name,
    is_active: inventoryEntity.is_active,
    stock_validation: inventoryEntity.stock_validation,
    created_at: '2026-07-01T00:00:00.000Z',
    updated_at: '2026-07-01T01:00:00.000Z',
    created_by: inventoryEntity.created_by,
    assigned_facility: inventoryEntity.assigned_facility,
    assigned_to: inventoryEntity.assigned_to,
  };

  const inventoryOperationModel = {
    id_inventory_operation: 'operation-1',
    latitude: null,
    longitude: null,
    inventory_operation_reference: 'ref-1',
    movement_type: inventoryOperationEntity.movement_type,
    document_reference: 'doc-1',
    created_at: '2026-07-01T00:00:00.000Z',
    created_by: inventoryOperationEntity.created_by,
    id_inventory_origin: inventoryOperationEntity.id_inventory_origin,
    id_inventory_target: inventoryOperationEntity.id_inventory_target,
  };

  const descriptionModel = {
    id_inventory_operation_description: 'desc-1',
    price_at_moment: 12,
    cost_at_moment: 10,
    quantity: 2,
    created_at: '2026-07-01T00:00:00.000Z',
    id_inventory_operation: 'operation-1',
    id_product: 'prod-1',
  };

  const balanceModel = {
    id_inventory_balance: 'balance-1',
    quantity: 10,
    min_quantity: null,
    max_quantity: null,
    created_at: '2026-07-01T00:00:00.000Z',
    updated_at: '2026-07-01T01:00:00.000Z',
    id_inventory: 'inv-1',
    id_product: 'prod-1',
  };

  beforeEach(() => {
    tables = {
      inventories: new QueryBuilderMock(),
      inventory_operations: new QueryBuilderMock(),
      inventory_operation_descriptions: new QueryBuilderMock(),
      inventories_balance: new QueryBuilderMock(),
    };

    mapper = {
      toModel: jest.fn(),
      toDomainObject: jest.fn(),
    };

    supabaseClient = {
      from: jest.fn((table: string) => tables[table]),
    };

    supabaseDataSource = {
      getClient: jest.fn(() => supabaseClient as never),
    };

    repository = new InventorySupabaseRepository(
      supabaseDataSource as unknown as SupabaseDataSource,
      mapper as unknown as EntityModelMapper,
    );
  });

  it('creates an inventory with the mapped model', async () => {
    mapper.toModel.mockReturnValue(inventoryModel);

    await expect(repository.CreateInventory(inventoryEntity)).resolves.toBeUndefined();

    expect(mapper.toModel).toHaveBeenCalledWith(inventoryEntity);
    expect(tables.inventories.insert).toHaveBeenCalledWith(inventoryModel);
  });

  it('wraps create inventory failures', async () => {
    mapper.toModel.mockReturnValue(inventoryModel);
    tables.inventories.setResult({ data: null, error: { message: 'insert failed' } });

    await expect(repository.CreateInventory(inventoryEntity)).rejects.toThrow(
      'Failed to create inventory: Failed to create inventory: insert failed',
    );
  });

  it('updates an inventory with the expected columns', async () => {
    mapper.toModel.mockReturnValue(inventoryModel);

    await expect(repository.UpdateInventory(inventoryEntity)).resolves.toBeUndefined();

    expect(tables.inventories.update).toHaveBeenCalledWith({
      inventory_context: inventoryModel.inventory_context,
      inventory_name: inventoryModel.inventory_name,
      is_active: inventoryModel.is_active,
      updated_at: inventoryModel.updated_at,
      created_by: inventoryModel.created_by,
      assigned_facility: inventoryModel.assigned_facility,
      assigned_to: inventoryModel.assigned_to,
    });
    expect(tables.inventories.eq).toHaveBeenCalledWith('id_inventory', inventoryModel.id_inventory);
  });

  it('wraps update inventory failures', async () => {
    mapper.toModel.mockReturnValue(inventoryModel);
    tables.inventories.setResult({ data: null, error: { message: 'update failed' } });

    await expect(repository.UpdateInventory(inventoryEntity)).rejects.toThrow(
      'Failed to update inventory: Failed to update inventory: update failed',
    );
  });

  it('creates an inventory operation and its descriptions when present', async () => {
    mapper.toModel
      .mockReturnValueOnce(inventoryOperationModel)
      .mockReturnValueOnce(descriptionModel);

    await expect(repository.CreateInventoryOperation(inventoryOperationEntity)).resolves.toBeUndefined();

    expect(tables.inventory_operations.insert).toHaveBeenCalledWith(inventoryOperationModel);
    expect(mapper.toModel).toHaveBeenCalledWith(
      inventoryOperationEntity.inventory_operation_descriptions[0],
    );
    expect(tables.inventory_operation_descriptions.insert).toHaveBeenCalledWith([descriptionModel]);
  });

  it('skips description insertion when the operation has no descriptions', async () => {
    mapper.toModel.mockReturnValue(inventoryOperationModel);

    await expect(
      repository.CreateInventoryOperation(inventoryWithoutDescriptions),
    ).resolves.toBeUndefined();

    expect(tables.inventory_operations.insert).toHaveBeenCalledWith(inventoryOperationModel);
    expect(tables.inventory_operation_descriptions.insert).not.toHaveBeenCalled();
  });

  it('wraps inventory operation description insert failures', async () => {
    mapper.toModel
      .mockReturnValueOnce(inventoryOperationModel)
      .mockReturnValueOnce(descriptionModel);
    tables.inventory_operation_descriptions.setResult({
      data: null,
      error: { message: 'description failed' },
    });

    await expect(repository.CreateInventoryOperation(inventoryOperationEntity)).rejects.toThrow(
      'Failed to create inventory operation: Failed to create inventory operation descriptions: description failed',
    );
  });

  it('upserts an inventory balance with the mapped model', async () => {
    mapper.toModel.mockReturnValue(balanceModel);

    await expect(repository.UpsertInventoryBalance(inventoryBalance)).resolves.toBeUndefined();

    expect(tables.inventories_balance.upsert).toHaveBeenCalledWith(balanceModel, {
      onConflict: 'id_inventory_balance',
    });
  });

  it('wraps upsert inventory balance failures', async () => {
    mapper.toModel.mockReturnValue(balanceModel);
    tables.inventories_balance.setResult({ data: null, error: { message: 'upsert failed' } });

    await expect(repository.UpsertInventoryBalance(inventoryBalance)).rejects.toThrow(
      'Failed to upsert inventory balance: Failed to upsert inventory balance: upsert failed',
    );
  });

  it('lists inventory operations with filters, cursor, and mapped descriptions', async () => {
    const mappedOperation = createInventoryOperationEntity({ id_inventory_operation: 'operation-1' });

    tables.inventory_operations.setResult({ data: [inventoryOperationModel], error: null });
    tables.inventory_operation_descriptions.setResult({ data: [descriptionModel], error: null });
    mapper.toDomainObject.mockReturnValue(mappedOperation);

    const result = await repository.listInventoryOperations(
      20,
      '2026-07-01T00:00:00.000Z',
      'operation-0',
      ['ref-1'],
      [inventoryOperationEntity.movement_type],
      ['doc-1'],
      ['user-1'],
      ['inv-origin'],
      ['inv-target'],
    );

    expect(tables.inventory_operations.in).toHaveBeenNthCalledWith(
      1,
      'inventory_operation_reference',
      ['ref-1'],
    );
    expect(tables.inventory_operations.in).toHaveBeenNthCalledWith(2, 'movement_type', [inventoryOperationEntity.movement_type]);
    expect(tables.inventory_operations.in).toHaveBeenNthCalledWith(3, 'document_reference', ['doc-1']);
    expect(tables.inventory_operations.in).toHaveBeenNthCalledWith(4, 'created_by', ['user-1']);
    expect(tables.inventory_operations.in).toHaveBeenNthCalledWith(5, 'id_inventory_origin', ['inv-origin']);
    expect(tables.inventory_operations.in).toHaveBeenNthCalledWith(6, 'id_inventory_target', ['inv-target']);
    expect(tables.inventory_operations.or).toHaveBeenCalledWith(
      'created_at.lt."2026-07-01T00:00:00.000Z",and(created_at.eq."2026-07-01T00:00:00.000Z",id_inventory_operation.lt."operation-0")',
    );
    expect(tables.inventory_operations.order).toHaveBeenNthCalledWith(1, 'created_at', { ascending: false });
    expect(tables.inventory_operations.order).toHaveBeenNthCalledWith(2, 'id_inventory_operation', { ascending: false });
    expect(tables.inventory_operations.limit).toHaveBeenCalledWith(20);
    expect(tables.inventory_operation_descriptions.in).toHaveBeenCalledWith('id_inventory_operation', ['operation-1']);
    expect(mapper.toDomainObject).toHaveBeenCalledWith(inventoryOperationModel, [descriptionModel]);
    expect(result).toEqual([mappedOperation]);
  });

  it('returns an empty operation list without querying descriptions when no operation rows are found', async () => {
    tables.inventory_operations.setResult({ data: [], error: null });

    await expect(repository.listInventoryOperations(10)).resolves.toEqual([]);

    expect(tables.inventory_operation_descriptions.in).not.toHaveBeenCalled();
    expect(mapper.toDomainObject).not.toHaveBeenCalled();
  });

  it('returns an empty operation list immediately when no ids are provided', async () => {
    await expect(repository.retrieveInventoryOperations([])).resolves.toEqual([]);

    expect(supabaseClient.from).not.toHaveBeenCalled();
  });

  it('retrieves inventory operations and maps their descriptions', async () => {
    const mappedOperation = createInventoryOperationEntity({ id_inventory_operation: 'operation-1' });

    tables.inventory_operations.setResult({ data: [inventoryOperationModel], error: null });
    tables.inventory_operation_descriptions.setResult({ data: [descriptionModel], error: null });
    mapper.toDomainObject.mockReturnValue(mappedOperation);

    const result = await repository.retrieveInventoryOperations(['operation-1']);

    expect(tables.inventory_operations.in).toHaveBeenCalledWith('id_inventory_operation', ['operation-1']);
    expect(tables.inventory_operation_descriptions.in).toHaveBeenCalledWith('id_inventory_operation', ['operation-1']);
    expect(mapper.toDomainObject).toHaveBeenCalledWith(inventoryOperationModel, [descriptionModel]);
    expect(result).toEqual([mappedOperation]);
  });

  it('lists inventories with filters, cursor, and mapped balances', async () => {
    const mappedInventory = createInventoryEntity({ id_inventory: 'inv-1' });

    tables.inventories.setResult({ data: [inventoryModel], error: null });
    tables.inventories_balance.setResult({ data: [balanceModel], error: null });
    mapper.toDomainObject.mockReturnValue(mappedInventory);

    const result = await repository.listInventories(
      15,
      '2026-07-01T00:00:00.000Z',
      'inv-0',
      [inventoryEntity.inventory_context],
      [inventoryEntity.inventory_name],
      [inventoryEntity.is_active],
      [inventoryEntity.created_by],
      [inventoryEntity.assigned_to!],
      [inventoryEntity.assigned_facility!],
    );

    expect(tables.inventories.in).toHaveBeenNthCalledWith(1, 'inventory_context', [inventoryEntity.inventory_context]);
    expect(tables.inventories.in).toHaveBeenNthCalledWith(2, 'inventory_name', [inventoryEntity.inventory_name]);
    expect(tables.inventories.in).toHaveBeenNthCalledWith(3, 'is_active', [inventoryEntity.is_active]);
    expect(tables.inventories.in).toHaveBeenNthCalledWith(4, 'created_by', [inventoryEntity.created_by]);
    expect(tables.inventories.in).toHaveBeenNthCalledWith(5, 'assigned_to', [inventoryEntity.assigned_to]);
    expect(tables.inventories.in).toHaveBeenNthCalledWith(6, 'assigned_facility', [inventoryEntity.assigned_facility]);
    expect(tables.inventories.or).toHaveBeenCalledWith(
      'created_at.lt."2026-07-01T00:00:00.000Z",and(created_at.eq."2026-07-01T00:00:00.000Z",id_inventory.lt."inv-0")',
    );
    expect(tables.inventories.order).toHaveBeenNthCalledWith(1, 'created_at', { ascending: false });
    expect(tables.inventories.order).toHaveBeenNthCalledWith(2, 'id_inventory', { ascending: false });
    expect(tables.inventories.limit).toHaveBeenCalledWith(15);
    expect(tables.inventories_balance.in).toHaveBeenCalledWith('id_inventory', ['inv-1']);
    expect(mapper.toDomainObject).toHaveBeenCalledWith(inventoryModel, [balanceModel]);
    expect(result).toEqual([mappedInventory]);
  });

  it('returns an empty inventory list without querying balances when no inventory rows are found', async () => {
    tables.inventories.setResult({ data: [], error: null });

    await expect(repository.listInventories(10)).resolves.toEqual([]);

    expect(tables.inventories_balance.in).not.toHaveBeenCalled();
    expect(mapper.toDomainObject).not.toHaveBeenCalled();
  });

  it('returns an empty inventory list immediately when no ids are provided', async () => {
    await expect(repository.retrieveInventories([])).resolves.toEqual([]);

    expect(supabaseClient.from).not.toHaveBeenCalled();
  });

  it('retrieves inventories and maps their balances', async () => {
    const mappedInventory = createInventoryEntity({ id_inventory: 'inv-1' });

    tables.inventories.setResult({ data: [inventoryModel], error: null });
    tables.inventories_balance.setResult({ data: [balanceModel], error: null });
    mapper.toDomainObject.mockReturnValue(mappedInventory);

    const result = await repository.retrieveInventories(['inv-1']);

    expect(tables.inventories.in).toHaveBeenCalledWith('id_inventory', ['inv-1']);
    expect(tables.inventories_balance.in).toHaveBeenCalledWith('id_inventory', ['inv-1']);
    expect(mapper.toDomainObject).toHaveBeenCalledWith(inventoryModel, [balanceModel]);
    expect(result).toEqual([mappedInventory]);
  });

  it('wraps list inventory failures', async () => {
    tables.inventories.setResult({ data: null, error: { message: 'list failed' } });

    await expect(repository.listInventories(10)).rejects.toThrow(
      'Failed to list inventories: Failed to list inventories: list failed',
    );
  });

  it('wraps list inventory operation failures', async () => {
    tables.inventory_operations.setResult({ data: null, error: { message: 'list failed' } });

    await expect(repository.listInventoryOperations(10)).rejects.toThrow(
      'Failed to list inventory operations: Failed to list inventory operations: list failed',
    );
  });
});