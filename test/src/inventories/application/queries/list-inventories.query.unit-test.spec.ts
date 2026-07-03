import { ListInventoriesQuery } from '@/src/inventories/application/queries/list-inventories.query';
import { InventoryEntity } from '@/src/inventories/core/entities/inventory.entity';
import { INVENTORY_CONTEXT_ENUM } from '@/src/inventories/core/enums/inventory-context.enum';
import { INVENTORY_STATE_ENUM } from '@/src/inventories/core/enums/inventory-state-enum';
import { STOCK_VALIDATION_ENUM } from '@/src/inventories/core/enums/stock-validation.enum';
import { InventoryRepository } from '@/src/inventories/core/interfaces/Inventory.repository';
import { EntityDtoMapper } from '@/src/inventories/application/mappers/entity-dto.mapper';

describe('ListInventoriesQuery', () => {
  const inventoryEntity = new InventoryEntity(
    'inv-1',
    INVENTORY_CONTEXT_ENUM.WAREHOUSE,
    'Main warehouse',
    INVENTORY_STATE_ENUM.ACTIVE,
    STOCK_VALIDATION_ENUM.ENABLE,
    new Date('2026-07-01T00:00:00.000Z'),
    new Date('2026-07-01T01:00:00.000Z'),
    'user-1',
    [],
    null,
    null,
  );

  let listInventories: jest.Mock;
  let mapperToDto: jest.Mock;
  let query: ListInventoriesQuery;

  beforeEach(() => {
    listInventories = jest.fn();
    mapperToDto = jest.fn();

    query = new ListInventoriesQuery(
      { listInventories } as unknown as InventoryRepository,
      { toDto: mapperToDto } as unknown as EntityDtoMapper,
    );
  });

  it('uses the default limit when no custom limit is provided', async () => {
    listInventories.mockResolvedValue([inventoryEntity]);
    mapperToDto.mockReturnValue({ id_inventory: 'inv-1' });

    const result = await query.execute();

    expect(listInventories).toHaveBeenCalledWith(
      1001,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );
    expect(mapperToDto).toHaveBeenCalledWith(inventoryEntity);
    expect(result).toEqual([{ id_inventory: 'inv-1' }]);
  });

  it('uses limit plus one and forwards all filters when limit is within the allowed range', async () => {
    listInventories.mockResolvedValue([inventoryEntity]);
    mapperToDto.mockReturnValue({ id_inventory: 'inv-1' });

    await query.execute(
      25,
      [INVENTORY_CONTEXT_ENUM.WAREHOUSE],
      ['Main warehouse'],
      [INVENTORY_STATE_ENUM.ACTIVE],
      ['user-1'],
      ['route-user-1'],
      ['facility-1'],
      'inv-0',
      '2026-06-30T00:00:00.000Z',
    );

    expect(listInventories).toHaveBeenCalledWith(
      26,
      '2026-06-30T00:00:00.000Z',
      'inv-0',
      [INVENTORY_CONTEXT_ENUM.WAREHOUSE],
      ['Main warehouse'],
      [INVENTORY_STATE_ENUM.ACTIVE],
      ['user-1'],
      ['route-user-1'],
      ['facility-1'],
    );
  });

  it('keeps the default limit when the requested limit is greater than 1000', async () => {
    listInventories.mockResolvedValue([]);

    await query.execute(1001);

    expect(listInventories).toHaveBeenCalledWith(
      1001,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );
  });

  it('throws when pagination metadata is incomplete', async () => {
    await expect(query.execute(undefined, undefined, undefined, undefined, undefined, undefined, undefined, 'inv-1')).rejects.toThrow(
      'If consulting a page larger than 1, pagination metadata is required.',
    );

    await expect(query.execute(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, '2026-06-30T00:00:00.000Z')).rejects.toThrow(
      'If consulting a page larger than 1, pagination metadata is required.',
    );
  });
});