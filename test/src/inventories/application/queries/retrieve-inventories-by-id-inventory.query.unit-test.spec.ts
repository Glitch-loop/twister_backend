import { EntityDtoMapper } from '@/src/inventories/application/mappers/entity-dto.mapper';
import { RetrieveInventoriesByIdInventoryQuery } from '@/src/inventories/application/queries/retrieve-inventories-by-id-inventory.query';
import { Inventory } from '@/src/inventories/core/interfaces/Inventory.repository';

import { createInventoryEntity } from '../test-helpers';

describe('RetrieveInventoriesByIdInventoryQuery', () => {
  let retrieveInventories: jest.Mock;
  let mapperToDto: jest.Mock;
  let query: RetrieveInventoriesByIdInventoryQuery;

  beforeEach(() => {
    retrieveInventories = jest.fn();
    mapperToDto = jest.fn();

    query = new RetrieveInventoriesByIdInventoryQuery(
      { retrieveInventories } as unknown as Inventory,
      { toDto: mapperToDto } as unknown as EntityDtoMapper,
    );
  });

  it('retrieves and maps inventories by id', async () => {
    const inventory = createInventoryEntity();
    retrieveInventories.mockResolvedValue([inventory]);
    mapperToDto.mockReturnValue({ id_inventory: 'inv-1' });

    const result = await query.execute(['inv-1']);

    expect(retrieveInventories).toHaveBeenCalledWith(['inv-1']);
    expect(mapperToDto).toHaveBeenCalledWith(inventory);
    expect(result).toEqual([{ id_inventory: 'inv-1' }]);
  });

  it('limits the retrieval to the first 100 ids', async () => {
    retrieveInventories.mockResolvedValue([]);
    const ids = Array.from({ length: 105 }, (_, index) => `inv-${index}`);

    await query.execute(ids);

    expect(retrieveInventories).toHaveBeenCalledWith(ids.slice(0, 100));
  });

  it('returns an empty array when no inventories are found', async () => {
    retrieveInventories.mockResolvedValue([]);

    const result = await query.execute([]);

    expect(result).toEqual([]);
    expect(mapperToDto).not.toHaveBeenCalled();
  });
});
