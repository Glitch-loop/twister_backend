import { UpdateInventoryCommand } from '@/src/inventories/application/commands/update-inventory.command';
import { STOCK_VALIDATION_ENUM } from '@/src/inventories/core/enums/stock-validation.enum';
import { Inventory } from '@/src/inventories/core/interfaces/Inventory.repository';
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

import { createInventoryBalance, createInventoryEntity } from '../test-helpers';

describe('UpdateInventoryCommand', () => {
  let retrieveInventories: jest.Mock;
  let updateInventory: jest.Mock;
  let upsertInventoryBalance: jest.Mock;
  let generateUUIDv4: jest.Mock;
  let command: UpdateInventoryCommand;

  beforeEach(() => {
    retrieveInventories = jest.fn();
    updateInventory = jest.fn().mockResolvedValue(undefined);
    upsertInventoryBalance = jest.fn().mockResolvedValue(undefined);
    generateUUIDv4 = jest.fn().mockReturnValue('generated-balance-id');

    command = new UpdateInventoryCommand(
      {
        retrieveInventories,
        UpdateInventory: updateInventory,
        UpsertInventoryBalance: upsertInventoryBalance,
      } as unknown as Inventory,
      { generateUUIDv4 } as unknown as IntegrityRepository,
    );
  });

  it('updates the inventory and upserts limits for provided products', async () => {
    retrieveInventories.mockResolvedValue([
      createInventoryEntity({
        inventory_balance: [createInventoryBalance()],
      }),
    ]);

    await command.execute('inv-1', '  Renamed inventory  ', STOCK_VALIDATION_ENUM.DISABLE, [
      { id_product: 'prod-1', min_quantity: 2, max_quantity: 25 },
      { id_product: 'prod-2', min_quantity: 1, max_quantity: 10 },
    ]);

    expect(generateUUIDv4).toHaveBeenCalledTimes(2);
    expect(upsertInventoryBalance).toHaveBeenCalledTimes(2);
    expect(updateInventory).toHaveBeenCalledWith(
      expect.objectContaining({
        inventory_name: 'Renamed inventory',
        stock_validation: STOCK_VALIDATION_ENUM.DISABLE,
      }),
    );
  });

  it('updates the inventory without touching balances when product limits are omitted', async () => {
    retrieveInventories.mockResolvedValue([createInventoryEntity()]);

    await command.execute('inv-1', undefined, STOCK_VALIDATION_ENUM.ENABLE);

    expect(upsertInventoryBalance).not.toHaveBeenCalled();
    expect(generateUUIDv4).not.toHaveBeenCalled();
    expect(updateInventory).toHaveBeenCalled();
  });

  it('throws when the inventory does not exist', async () => {
    retrieveInventories.mockResolvedValue([]);

    await expect(command.execute('missing-inventory')).rejects.toThrow(
      'Inventory with id missing-inventory does not exist.',
    );

    expect(updateInventory).not.toHaveBeenCalled();
  });
});