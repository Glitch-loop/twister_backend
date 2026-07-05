import { CreateInventoryCommand } from '@/src/inventories/application/commands/create-inventory.command';
import { INVENTORY_CONTEXT_ENUM } from '@/src/inventories/core/enums/inventory-context.enum';
import { STOCK_VALIDATION_ENUM } from '@/src/inventories/core/enums/stock-validation.enum';
import { InventoryRepository } from '@/src/inventories/core/interfaces/Inventory.repository';
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';
import { BusinessRuleException } from '@/src/shared/errors/BusinessRuleException';

describe('CreateInventoryCommand', () => {
  let createInventory: jest.Mock;
  let generateUUIDv4: jest.Mock;
  let command: CreateInventoryCommand;

  beforeEach(() => {
    createInventory = jest.fn().mockResolvedValue(undefined);
    generateUUIDv4 = jest.fn().mockReturnValue('generated-id');

    command = new CreateInventoryCommand(
      { CreateInventory: createInventory } as unknown as InventoryRepository,
      { generateUUIDv4 } as unknown as IntegrityRepository,
    );
  });

  it('creates an inventory with generated id, default stock validation, and trimmed name', async () => {
    await command.execute(
      INVENTORY_CONTEXT_ENUM.WAREHOUSE,
      '  Main warehouse  ',
      'user-1',
      undefined,
      'assigned-user-1',
    );

    expect(generateUUIDv4).toHaveBeenCalled();
    expect(createInventory).toHaveBeenCalledWith(
      expect.objectContaining({
        id_inventory: 'generated-id',
        inventory_context: INVENTORY_CONTEXT_ENUM.WAREHOUSE,
        inventory_name: 'Main warehouse',
        stock_validation: STOCK_VALIDATION_ENUM.ENABLE,
        assigned_to: 'assigned-user-1',
        assigned_facility: null,
      }),
    );
  });

  it('creates an inventory with explicit id, explicit stock validation, and assigned facility', async () => {
    await command.execute(
      INVENTORY_CONTEXT_ENUM.PRODUCT_RESERVATION,
      'Reservation inventory',
      'user-1',
      STOCK_VALIDATION_ENUM.DISABLE,
      undefined,
      'facility-1',
      'inventory-id-1',
    );

    expect(generateUUIDv4).not.toHaveBeenCalled();
    expect(createInventory).toHaveBeenCalledWith(
      expect.objectContaining({
        id_inventory: 'inventory-id-1',
        inventory_context: INVENTORY_CONTEXT_ENUM.PRODUCT_RESERVATION,
        stock_validation: STOCK_VALIDATION_ENUM.DISABLE,
        assigned_to: null,
        assigned_facility: 'facility-1',
      }),
    );
  });

  it('throws when neither assigned user nor assigned facility is provided', async () => {
    await expect(
      command.execute(
        INVENTORY_CONTEXT_ENUM.WAREHOUSE,
        'Main warehouse',
        'user-1',
      ),
    ).rejects.toThrow(BusinessRuleException);

    expect(createInventory).not.toHaveBeenCalled();
  });
});
