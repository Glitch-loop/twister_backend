import { EntityDtoMapper } from '@/src/inventories/application/mappers/entity-dto.mapper';
import { ListInventoryOperationsQuery } from '@/src/inventories/application/queries/list-inventory-operations.query';
import { MOVEMENT_TYPE_ENUM } from '@/src/inventories/core/enums/movement-type.enum';
import { Inventory } from '@/src/inventories/core/interfaces/Inventory.repository';

import { createInventoryOperationEntity } from '../test-helpers';

describe('ListInventoryOperationsQuery', () => {
  let listInventoryOperations: jest.Mock;
  let mapperToDto: jest.Mock;
  let query: ListInventoryOperationsQuery;

  beforeEach(() => {
    listInventoryOperations = jest.fn();
    mapperToDto = jest.fn();

    query = new ListInventoryOperationsQuery(
      { listInventoryOperations } as unknown as Inventory,
      { toDto: mapperToDto } as unknown as EntityDtoMapper,
    );
  });

  it('uses the default limit when no custom limit is provided', async () => {
    const operation = createInventoryOperationEntity();
    listInventoryOperations.mockResolvedValue([operation]);
    mapperToDto.mockReturnValue({ id_inventory_operation: 'operation-1' });

    const result = await query.execute();

    expect(listInventoryOperations).toHaveBeenCalledWith(
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
    expect(mapperToDto).toHaveBeenCalledWith(operation);
    expect(result).toEqual([{ id_inventory_operation: 'operation-1' }]);
  });

  it('uses limit plus one and forwards all filters when the limit is allowed', async () => {
    listInventoryOperations.mockResolvedValue([]);

    await query.execute(
      30,
      ['reference-1'],
      [MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT],
      ['doc-1'],
      ['user-1'],
      ['inv-origin'],
      ['inv-target'],
      'operation-0',
      '2026-06-30T00:00:00.000Z',
    );

    expect(listInventoryOperations).toHaveBeenCalledWith(
      31,
      '2026-06-30T00:00:00.000Z',
      'operation-0',
      ['reference-1'],
      [MOVEMENT_TYPE_ENUM.INTERNAL_MOVEMENT],
      ['doc-1'],
      ['user-1'],
      ['inv-origin'],
      ['inv-target'],
    );
  });

  it('keeps the default limit when the requested limit is greater than 1000', async () => {
    listInventoryOperations.mockResolvedValue([]);

    await query.execute(1001);

    expect(listInventoryOperations).toHaveBeenCalledWith(
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
    await expect(query.execute(undefined, undefined, undefined, undefined, undefined, undefined, undefined, 'operation-1')).rejects.toThrow(
      'If consulting a page larger than 1, pagination metadata is required.',
    );

    await expect(query.execute(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, '2026-06-30T00:00:00.000Z')).rejects.toThrow(
      'If consulting a page larger than 1, pagination metadata is required.',
    );
  });
});
