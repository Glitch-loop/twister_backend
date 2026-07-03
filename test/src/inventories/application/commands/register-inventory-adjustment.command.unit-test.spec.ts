import { EventEmitter2 } from '@nestjs/event-emitter';

import { RegisterInventoryAdjustmentCommand } from '@/src/inventories/application/commands/register-inventory-adjustment.command';
import { EntityDtoMapper } from '@/src/inventories/application/mappers/entity-dto.mapper';
import { INVENTORY_CONTEXT_ENUM } from '@/src/inventories/core/enums/inventory-context.enum';
import { MOVEMENT_TYPE_ENUM } from '@/src/inventories/core/enums/movement-type.enum';
import { InventoryRepository } from '@/src/inventories/core/interfaces/Inventory.repository';
import { ProductRepository } from '@/src/products/core/interfaces/ProductRepository.repository';
import { DOMAIN_EVENT_ENUM } from '@/src/shared/core/enums/domain-event.enum';
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

import { createInventoryBalance, createInventoryEntity, createProductEntity } from '../../../../test-helpers';

describe('RegisterInventoryAdjustmentCommand', () => {
  let retrieveInventories: jest.Mock;
  let listInventories: jest.Mock;
  let createInventory: jest.Mock;
  let createInventoryOperation: jest.Mock;
  let upsertInventoryBalance: jest.Mock;
  let retrieveProducts: jest.Mock;
  let generateUUIDv4: jest.Mock;
  let emit: jest.Mock;
  let mapperToDto: jest.Mock;
  let command: RegisterInventoryAdjustmentCommand;

  beforeEach(() => {
    retrieveInventories = jest.fn();
    listInventories = jest.fn();
    createInventory = jest.fn().mockResolvedValue(undefined);
    createInventoryOperation = jest.fn().mockResolvedValue(undefined);
    upsertInventoryBalance = jest.fn().mockResolvedValue(undefined);
    retrieveProducts = jest.fn();
    generateUUIDv4 = jest.fn()
      .mockReturnValueOnce('generated-operation-id')
      .mockReturnValueOnce('generated-desc-id-1')
      .mockReturnValueOnce('generated-origin-balance-id-1')
      .mockReturnValueOnce('generated-target-balance-id-1')
      .mockReturnValueOnce('generated-desc-id-2')
      .mockReturnValueOnce('generated-origin-balance-id-2')
      .mockReturnValueOnce('generated-target-balance-id-2');
    emit = jest.fn();
    mapperToDto = jest.fn().mockReturnValue({ id_inventory_operation: 'generated-operation-id' });

    command = new RegisterInventoryAdjustmentCommand(
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

  it('creates an adjustment operation for positive and negative quantities', async () => {
    retrieveInventories.mockResolvedValue([
      createInventoryEntity({
        id_inventory: 'inv-origin',
        inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE,
        inventory_balance: [
          createInventoryBalance({ quantity: 10, id_inventory: 'inv-origin', id_product: 'prod-1' }),
          createInventoryBalance({
            id_inventory_balance: 'balance-2',
            quantity: 4,
            id_inventory: 'inv-origin',
            id_product: 'prod-2',
          }),
        ],
      }),
    ]);
    listInventories.mockResolvedValue([
      createInventoryEntity({
        id_inventory: 'adjustment-virtual',
        inventory_context: INVENTORY_CONTEXT_ENUM.ADJUSTMENT_VIRTUAL,
        inventory_balance: [],
      }),
    ]);
    retrieveProducts.mockResolvedValue([
      createProductEntity({ id_product: 'prod-1' }),
      createProductEntity({ id_product: 'prod-2' }),
    ]);

    await command.execute('inv-origin', 'user-1', [
      { price_at_moment: 12.5, cost_at_moment: 10.1, quantity: 2, id_product: 'prod-1' },
      { price_at_moment: 8.5, cost_at_moment: 6.1, quantity: -1, id_product: 'prod-2' },
    ]);

    expect(createInventoryOperation).toHaveBeenCalledWith(
      expect.objectContaining({
        movement_type: MOVEMENT_TYPE_ENUM.ADJUSTMENT,
        id_inventory_origin: 'inv-origin',
        id_inventory_target: 'adjustment-virtual',
      }),
    );
    expect(upsertInventoryBalance).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith(
      DOMAIN_EVENT_ENUM.INVENTORY_OPERATION_EVENT,
      { id_inventory_operation: 'generated-operation-id' },
    );
  });

  it('creates the adjustment virtual inventory when it does not exist', async () => {
    retrieveInventories.mockResolvedValue([
      createInventoryEntity({
        id_inventory: 'inv-origin',
        inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE,
        inventory_balance: [createInventoryBalance({ quantity: 10, id_inventory: 'inv-origin', id_product: 'prod-1' })],
      }),
    ]);
    listInventories.mockResolvedValue([]);
    retrieveProducts.mockResolvedValue([createProductEntity({ id_product: 'prod-1' })]);

    await command.execute('inv-origin', 'user-1', [
      { price_at_moment: 12.5, cost_at_moment: 10.1, quantity: 2, id_product: 'prod-1' },
    ]);

    expect(createInventory).toHaveBeenCalledWith(
      expect.objectContaining({ inventory_context: INVENTORY_CONTEXT_ENUM.ADJUSTMENT_VIRTUAL }),
    );
  });

  it('throws when inventory operation descriptions are missing', async () => {
    await expect(command.execute('inv-origin', 'user-1', [])).rejects.toThrow(
      'Inventory operation descriptions are required.',
    );
  });
});