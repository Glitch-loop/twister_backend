import { DeactiveInventoryCommand } from '@/src/inventories/application/commands/deactive-inventory.command';
import { INVENTORY_STATE_ENUM } from '@/src/inventories/core/enums/inventory-state-enum';
import { InventoryRepository } from '@/src/inventories/core/interfaces/Inventory.repository';

import { createInventoryEntity } from '../../../../utils/test-creation-artifact.helper';

describe('DeactiveInventoryCommand', () => {
  let retrieveInventories: jest.Mock;
  let updateInventory: jest.Mock;
  let command: DeactiveInventoryCommand;

  beforeEach(() => {
    retrieveInventories = jest.fn();
    updateInventory = jest.fn().mockResolvedValue(undefined);

    command = new DeactiveInventoryCommand(
      {
        retrieveInventories,
        UpdateInventory: updateInventory,
      } as unknown as InventoryRepository,
    );
  });

  it('deactivates an existing inventory', async () => {
    retrieveInventories.mockResolvedValue([createInventoryEntity()]);

    await command.execute('inv-1');

    expect(retrieveInventories).toHaveBeenCalledWith(['inv-1']);
    expect(updateInventory).toHaveBeenCalledWith(
      expect.objectContaining({ is_active: INVENTORY_STATE_ENUM.DEACTIVE }),
    );
  });

  it('throws when the inventory does not exist', async () => {
    retrieveInventories.mockResolvedValue([]);

    await expect(command.execute('missing-inventory')).rejects.toThrow(
      'Inventory with id missing-inventory does not exist.',
    );

    expect(updateInventory).not.toHaveBeenCalled();
  });
});
