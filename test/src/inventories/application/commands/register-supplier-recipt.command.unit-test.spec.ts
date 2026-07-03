import { EventEmitter2 } from '@nestjs/event-emitter';

import { RegisterSupplierReciptCommand } from '@/src/inventories/application/commands/register-supplier-recipt.command';
import { EntityDtoMapper } from '@/src/inventories/application/mappers/entity-dto.mapper';
import { INVENTORY_CONTEXT_ENUM } from '@/src/inventories/core/enums/inventory-context.enum';
import { MOVEMENT_TYPE_ENUM } from '@/src/inventories/core/enums/movement-type.enum';
import { InventoryRepository } from '@/src/inventories/core/interfaces/Inventory.repository';
import { ProductRepository } from '@/src/products/core/interfaces/ProductRepository.repository';
import { PRODUCT_STATUS_ENUM } from '@/src/products/core/enums/product-status.enum';
import { DOMAIN_EVENT_ENUM } from '@/src/shared/core/enums/domain-event.enum';
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

import { createInventoryEntity, createProductEntity } from '../../../../test-helpers';

describe('RegisterSupplierReciptCommand', () => {
  let retrieveInventories: jest.Mock;
  let listInventories: jest.Mock;
  let createInventory: jest.Mock;
  let createInventoryOperation: jest.Mock;
  let upsertInventoryBalance: jest.Mock;
  let retrieveProducts: jest.Mock;
  let generateUUIDv4: jest.Mock;
  let emit: jest.Mock;
  let mapperToDto: jest.Mock;
  let command: RegisterSupplierReciptCommand;

  beforeEach(() => {
    retrieveInventories = jest.fn();
    listInventories = jest.fn();
    createInventory = jest.fn().mockResolvedValue(undefined);
    createInventoryOperation = jest.fn().mockResolvedValue(undefined);
    upsertInventoryBalance = jest.fn().mockResolvedValue(undefined);
    retrieveProducts = jest.fn();
    generateUUIDv4 = jest.fn()
      .mockReturnValueOnce('generated-operation-id')
      .mockReturnValueOnce('generated-desc-id')
      .mockReturnValueOnce('generated-origin-balance-id')
      .mockReturnValueOnce('generated-target-balance-id');
    emit = jest.fn();
    mapperToDto = jest.fn().mockReturnValue({ id_inventory_operation: 'generated-operation-id' });

    command = new RegisterSupplierReciptCommand(
      {
        retrieveInventories,
        listInventories,
        CreateInventory: createInventory,
        CreateInventoryOperation: createInventoryOperation,
        UpsertInventoryBalance: upsertInventoryBalance,
      } as unknown as InventoryRepository,
      { retrieveProducts } as unknown as ProductRepository,
      { generateUUIDv4 } as unknown as IntegrityRepository,
      { emit } as unknown as EventEmitter2,
      { toDto: mapperToDto } as unknown as EntityDtoMapper,
    );
  });

  it('creates a supplier receipt operation and emits the mapped dto', async () => {
    listInventories.mockResolvedValue([
      createInventoryEntity({
        id_inventory: 'supplier-virtual',
        inventory_context: INVENTORY_CONTEXT_ENUM.INVENTORY_SUPPLIER_VIRTUAL,
        inventory_balance: [],
      }),
    ]);
    retrieveInventories.mockResolvedValue([
      createInventoryEntity({
        id_inventory: 'inv-target',
        inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE,
        inventory_balance: [],
      }),
    ]);
    retrieveProducts.mockResolvedValue([createProductEntity({ id_product: 'prod-1' })]);

    await command.execute('inv-target', 'user-1', [
      { price_at_moment: 12.5, cost_at_moment: 10.1, quantity: 2, id_product: 'prod-1' },
    ]);

    expect(createInventoryOperation).toHaveBeenCalledWith(
      expect.objectContaining({
        movement_type: MOVEMENT_TYPE_ENUM.SUPPLIER_RECIPT,
        id_inventory_origin: 'supplier-virtual',
        id_inventory_target: 'inv-target',
      }),
    );
    expect(emit).toHaveBeenCalledWith(
      DOMAIN_EVENT_ENUM.INVENTORY_OPERATION_EVENT,
      { id_inventory_operation: 'generated-operation-id' },
    );
  });

  it('creates the supplier virtual inventory when it does not exist', async () => {
    listInventories.mockResolvedValue([]);
    retrieveInventories.mockResolvedValue([
      createInventoryEntity({
        id_inventory: 'inv-target',
        inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE,
        inventory_balance: [],
      }),
    ]);
    retrieveProducts.mockResolvedValue([createProductEntity({ id_product: 'prod-1' })]);

    await command.execute('inv-target', 'user-1', [
      { price_at_moment: 12.5, cost_at_moment: 10.1, quantity: 2, id_product: 'prod-1' },
    ]);

    expect(createInventory).toHaveBeenCalledWith(
      expect.objectContaining({ inventory_context: INVENTORY_CONTEXT_ENUM.INVENTORY_SUPPLIER_VIRTUAL }),
    );
  });

  it('throws when a product is inactive', async () => {
    listInventories.mockResolvedValue([
      createInventoryEntity({
        id_inventory: 'supplier-virtual',
        inventory_context: INVENTORY_CONTEXT_ENUM.INVENTORY_SUPPLIER_VIRTUAL,
        inventory_balance: [],
      }),
    ]);
    retrieveInventories.mockResolvedValue([
      createInventoryEntity({
        id_inventory: 'inv-target',
        inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE,
        inventory_balance: [],
      }),
    ]);
    retrieveProducts.mockResolvedValue([
      createProductEntity({ id_product: 'prod-1', product_status: PRODUCT_STATUS_ENUM.INACTIVE }),
    ]);

    await expect(
      command.execute('inv-target', 'user-1', [
        { price_at_moment: 12.5, cost_at_moment: 10.1, quantity: 2, id_product: 'prod-1' },
      ]),
    ).rejects.toThrow('Product with id prod-1 is not active and cannot be used in inventory operation.');
  });
});
