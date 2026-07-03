import { EventEmitter2 } from '@nestjs/event-emitter';

import { RegisterInventoryOperatonBetweenInventoriesCommand } from '@/src/inventories/application/commands/register-inventory-operaton-between-inventories.command';
import { EntityDtoMapper } from '@/src/inventories/application/mappers/entity-dto.mapper';
import { INVENTORY_CONTEXT_ENUM } from '@/src/inventories/core/enums/inventory-context.enum';
import { MOVEMENT_TYPE_ENUM } from '@/src/inventories/core/enums/movement-type.enum';
import { InventoryRepository } from '@/src/inventories/core/interfaces/Inventory.repository';
import { ProductRepository } from '@/src/products/core/interfaces/ProductRepository.repository';
import { DOMAIN_EVENT_ENUM } from '@/src/shared/core/enums/domain-event.enum';
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

import { createInventoryBalance, createInventoryEntity, createProductEntity } from '../../../../test-helpers';

describe('RegisterInventoryOperatonBetweenInventoriesCommand', () => {
  let retrieveInventories: jest.Mock;
  let createInventoryOperation: jest.Mock;
  let upsertInventoryBalance: jest.Mock;
  let retrieveProducts: jest.Mock;
  let generateUUIDv4: jest.Mock;
  let emit: jest.Mock;
  let mapperToDto: jest.Mock;
  let command: RegisterInventoryOperatonBetweenInventoriesCommand;

  beforeEach(() => {
    retrieveInventories = jest.fn();
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

    command = new RegisterInventoryOperatonBetweenInventoriesCommand(
      {
        retrieveInventories,
        CreateInventoryOperation: createInventoryOperation,
        UpsertInventoryBalance: upsertInventoryBalance,
      } as unknown as InventoryRepository,
      { retrieveProducts } as unknown as ProductRepository,
      { generateUUIDv4 } as unknown as IntegrityRepository,
      { emit } as unknown as EventEmitter2,
      { toDto: mapperToDto } as unknown as EntityDtoMapper,
    );
  });

  it('creates an internal inventory operation and emits the mapped dto', async () => {
    retrieveInventories.mockImplementation(async ([id_inventory]: string[]) => {
      if (id_inventory === 'inv-origin') {
        return [
          createInventoryEntity({
            id_inventory,
            inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE,
            inventory_balance: [createInventoryBalance({ quantity: 10, id_inventory, id_product: 'prod-1' })],
          }),
        ];
      }

      return [
        createInventoryEntity({
          id_inventory,
          inventory_context: INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE,
          inventory_balance: [],
        }),
      ];
    });
    retrieveProducts.mockResolvedValue([createProductEntity({ id_product: 'prod-1' })]);

    await command.execute('inv-origin', 'inv-target', 'user-1', [
      {
        price_at_moment: 12.5,
        cost_at_moment: 10.1,
        quantity: 2,
        id_product: 'prod-1',
      },
    ]);

    expect(createInventoryOperation).toHaveBeenCalledWith(
      expect.objectContaining({
        movement_type: MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT,
        id_inventory_origin: 'inv-origin',
        id_inventory_target: 'inv-target',
      }),
    );
    expect(upsertInventoryBalance).toHaveBeenCalledTimes(2);
    expect(emit).toHaveBeenCalledWith(
      DOMAIN_EVENT_ENUM.INVENTORY_OPERATION_EVENT,
      { id_inventory_operation: 'generated-operation-id' },
    );
  });

  it('throws when inventory operation descriptions are missing', async () => {
    await expect(command.execute('inv-origin', 'inv-target', 'user-1', [])).rejects.toThrow(
      'Inventory operation descriptions are required.',
    );

    expect(createInventoryOperation).not.toHaveBeenCalled();
  });

  it('throws when a product is inactive', async () => {
    retrieveInventories.mockResolvedValue([
      createInventoryEntity({ id_inventory: 'inv-origin', inventory_balance: [createInventoryBalance()] }),
    ]);
    retrieveProducts.mockResolvedValue([createProductEntity({ product_status: 0 })]);

    await expect(
      command.execute('inv-origin', 'inv-target', 'user-1', [
        {
          price_at_moment: 12.5,
          cost_at_moment: 10.1,
          quantity: 2,
          id_product: 'prod-1',
        },
      ]),
    ).rejects.toThrow('Product with id prod-1 is not active and cannot be used in inventory operation.');

    expect(createInventoryOperation).not.toHaveBeenCalled();
  });
});
