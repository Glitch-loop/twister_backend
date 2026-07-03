import { EntityDtoMapper } from '@/src/inventories/application/mappers/entity-dto.mapper';
import { RetrieveInventoryOperationsByIdInventoryOperationQuery } from '@/src/inventories/application/queries/retrieve-inventory-operations-by-id-inventory-operation.query';
import { Inventory } from '@/src/inventories/core/interfaces/Inventory.repository';

import { createInventoryOperationEntity } from '../test-helpers';

describe('RetrieveInventoryOperationsByIdInventoryOperationQuery', () => {
  let retrieveInventoryOperations: jest.Mock;
  let mapperToDto: jest.Mock;
  let query: RetrieveInventoryOperationsByIdInventoryOperationQuery;

  beforeEach(() => {
    retrieveInventoryOperations = jest.fn();
    mapperToDto = jest.fn();

    query = new RetrieveInventoryOperationsByIdInventoryOperationQuery(
      { retrieveInventoryOperations } as unknown as Inventory,
      { toDto: mapperToDto } as unknown as EntityDtoMapper,
    );
  });

  it('retrieves and maps operations by id', async () => {
    const inventoryOperation = createInventoryOperationEntity();
    retrieveInventoryOperations.mockResolvedValue([inventoryOperation]);
    mapperToDto.mockReturnValue({ id_inventory_operation: 'operation-1' });

    const result = await query.execute(['operation-1']);

    expect(retrieveInventoryOperations).toHaveBeenCalledWith(['operation-1']);
    expect(mapperToDto).toHaveBeenCalledWith(inventoryOperation);
    expect(result).toEqual([{ id_inventory_operation: 'operation-1' }]);
  });

  it('limits the retrieval to the first 100 ids', async () => {
    retrieveInventoryOperations.mockResolvedValue([]);
    const ids = Array.from({ length: 104 }, (_, index) => `operation-${index}`);

    await query.execute(ids);

    expect(retrieveInventoryOperations).toHaveBeenCalledWith(ids.slice(0, 100));
  });

  it('returns an empty array when no operations are found', async () => {
    retrieveInventoryOperations.mockResolvedValue([]);

    const result = await query.execute([]);

    expect(result).toEqual([]);
    expect(mapperToDto).not.toHaveBeenCalled();
  });
});
