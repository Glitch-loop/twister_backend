import { Test, TestingModule } from '@nestjs/testing';
import { InventorySupabaseRepository } from '@/src/inventories/infrastructure/repositories/supabase/inventory-supabase.repository';
import { EntityModelMapper } from '@/src/inventories/application/mappers/entity-model.mapper';
import { SupabaseDataSource } from '@/src/shared/infrastructure/datasources/supabase-data-source';
import { InventoryRepository } from '@/src/inventories/core/interfaces/Inventory.repository';
import {
  createFacilityModel,
  createFacilityTypeModel,
  createInventoryBalance,
  createInventoryEntity,
  createInventoryOperationEntity,
  createUserModel,
} from '@/test/utils/test-creation-artifact.helper';
import { SupabaseClient } from '@supabase/supabase-js';
import { dumpRecordType } from '@/test/types/dump-record.types';
import { createDumpRecordInDatabase, deleteDumpRecordInDatabase } from '@/test/utils/dump-creation-records-supabase.helper';
import { dumpRecordInterface } from '@/test/interfaces/dump-record.interface';

describe('Inventory supabase repository', () => {
  let moduleRef: TestingModule;
  let supabaseDataSource: SupabaseDataSource;
  let repository: InventorySupabaseRepository;
  let inventoryRepository: InventoryRepository;
  let supabaseClient: SupabaseClient;
  let dumpRecords: dumpRecordInterface[];

  const trackDumpRecord = async <T extends object>(recordType: dumpRecordType, id: string, payload: T) => {
    const record = await createDumpRecordInDatabase(supabaseClient, id, recordType, payload);
    dumpRecords.push(record);
    return record;
  };

  const seedInventoryDependencies = async () => {
    const userTest = createUserModel();
    const facilityTypeTest = createFacilityTypeModel();
    const facilityTest = createFacilityModel({ id_facility_type: facilityTypeTest.id_facility_type });

    await trackDumpRecord('users', userTest.id_user, userTest);
    await trackDumpRecord('facility_types', facilityTypeTest.id_facility_type, facilityTypeTest);
    await trackDumpRecord('facilities', facilityTest.id_facility, facilityTest);

    return { userTest, facilityTypeTest, facilityTest };
  };

  beforeEach(async () => {
    dumpRecords = [];

    moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [
        SupabaseDataSource,
        InventorySupabaseRepository,
        EntityModelMapper,
        {
          provide: InventoryRepository,
          useExisting: InventorySupabaseRepository,
        },
      ],
    }).compile();

    supabaseDataSource = moduleRef.get(SupabaseDataSource);
    repository = moduleRef.get(InventorySupabaseRepository);
    inventoryRepository = moduleRef.get(InventoryRepository);

    supabaseClient = supabaseDataSource.getClient();
  });

  afterEach(async () => {
    if (dumpRecords.length > 0) {
      await deleteDumpRecordInDatabase(supabaseClient, dumpRecords);
    }

    await moduleRef.close();
  });

  it('instantiates providers through the testing module', () => {
    expect(supabaseDataSource).toBeDefined();
    expect(repository).toBeDefined();
    expect(inventoryRepository).toBe(repository);
  });

  it('creates an inventory and persists it in the database', async () => {
    const { userTest, facilityTest } = await seedInventoryDependencies();
    const createInventory = createInventoryEntity({
      inventory_name: `TEST Warehouse ${new Date().toISOString()}`,
      assigned_facility: facilityTest.id_facility,
      assigned_to: null,
      created_by: userTest.id_user,
    });

    await trackDumpRecord('inventories', createInventory.id_inventory, createInventory);

    await expect(repository.CreateInventory(createInventory)).resolves.toBeUndefined();

    const storedInventories = await repository.retrieveInventories([createInventory.id_inventory]);

    expect(storedInventories).toHaveLength(1);
    expect(storedInventories[0].id_inventory).toBe(createInventory.id_inventory);
    expect(storedInventories[0].inventory_name).toBe(createInventory.inventory_name);
    expect(storedInventories[0].assigned_facility).toBe(facilityTest.id_facility);
    expect(storedInventories[0].assigned_to).toBeNull();
  });

  it('updates an existing inventory and keeps the stored record in sync', async () => {
    const { userTest, facilityTest } = await seedInventoryDependencies();
    const existingInventory = createInventoryEntity({
      inventory_name: 'Original warehouse name',
      assigned_facility: facilityTest.id_facility,
      assigned_to: null,
      created_by: userTest.id_user,
    });

    await trackDumpRecord('inventories', existingInventory.id_inventory, existingInventory);

    const updatedInventory = createInventoryEntity({
      id_inventory: existingInventory.id_inventory,
      inventory_name: 'Updated warehouse name',
      assigned_facility: facilityTest.id_facility,
      assigned_to: null,
      created_by: userTest.id_user,
    });

    await expect(repository.UpdateInventory(updatedInventory)).resolves.toBeUndefined();

    const storedInventories = await repository.retrieveInventories([existingInventory.id_inventory]);

    expect(storedInventories).toHaveLength(1);
    expect(storedInventories[0].inventory_name).toBe('Updated warehouse name');
  });

  it('creates an inventory operation without descriptions', async () => {
    const { userTest, facilityTest } = await seedInventoryDependencies();
    const originInventory = createInventoryEntity({
      inventory_name: 'Origin inventory',
      assigned_facility: facilityTest.id_facility,
      assigned_to: null,
      created_by: userTest.id_user,
    });
    const targetInventory = createInventoryEntity({
      inventory_name: 'Target inventory',
      assigned_facility: facilityTest.id_facility,
      assigned_to: null,
      created_by: userTest.id_user,
    });

    await trackDumpRecord('inventories', originInventory.id_inventory, originInventory);
    await trackDumpRecord('inventories', targetInventory.id_inventory, targetInventory);

    const inventoryOperation = createInventoryOperationEntity({
      created_by: userTest.id_user,
      id_inventory_origin: originInventory.id_inventory,
      id_inventory_target: targetInventory.id_inventory,
      inventory_operation_descriptions: [],
    });

    await expect(repository.CreateInventoryOperation(inventoryOperation)).resolves.toBeUndefined();

    const storedOperations = await repository.retrieveInventoryOperations([inventoryOperation.id_inventory_operation]);

    expect(storedOperations).toHaveLength(1);
    expect(storedOperations[0].id_inventory_operation).toBe(inventoryOperation.id_inventory_operation);
    expect(storedOperations[0].inventory_operation_descriptions).toHaveLength(0);
  });

  // it('upserts an inventory balance and exposes it through inventory retrieval', async () => {
  //   const { userTest, facilityTest } = await seedInventoryDependencies();
  //   const inventory = createInventoryEntity({
  //     inventory_name: 'Inventory with balance',
  //     assigned_facility: facilityTest.id_facility,
  //     assigned_to: null,
  //     created_by: userTest.id_user,
  //   });

  //   await trackDumpRecord('inventories', inventory.id_inventory, inventory);

  //   const inventoryBalance = createInventoryBalance({
  //     id_inventory: inventory.id_inventory,
  //     id_inventory_balance: 'balance-1',
  //     id_product: 'product-1',
  //     min_quantity: 2,
  //     max_quantity: 20,
  //   });

  //   await expect(repository.UpsertInventoryBalance(inventoryBalance)).resolves.toBeUndefined();

  //   const storedInventories = await repository.retrieveInventories([inventory.id_inventory]);

  //   expect(storedInventories).toHaveLength(1);
  //   expect(storedInventories[0].inventory_balance).toHaveLength(1);
  //   expect(storedInventories[0].inventory_balance[0].id_inventory_balance).toBe('balance-1');
  //   expect(storedInventories[0].inventory_balance[0].min_quantity).toBe(2);
  //   expect(storedInventories[0].inventory_balance[0].max_quantity).toBe(20);
  // });
});