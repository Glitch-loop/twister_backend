import { Inject, Injectable } from '@nestjs/common';

import { InventoryOperationDto } from '@/src/inventories/application/dtos/inventory-operation.dto';
import { EntityDtoMapper } from '@/src/inventories/application/mappers/entity-dto.mapper';
import { InventoryOperationEntity } from '@/src/inventories/core/entities/inventory-operation.entity';
import { Inventory } from '@/src/inventories/core/interfaces/Inventory.repository';

@Injectable()
export class RetrieveInventoryOperationsByIdInventoryOperationQuery {
  constructor(
    @Inject(Inventory)
    private readonly inventoryRepository: Inventory,
    private readonly mapper: EntityDtoMapper,
  ) {}

  async execute(idInventoryOperation: string[]): Promise<InventoryOperationDto[]> {
    const maxIds = 100;
    const idsToRetrieve = idInventoryOperation.slice(0, maxIds);

    const inventoryOperations: InventoryOperationEntity[] =
      await this.inventoryRepository.retrieveInventoryOperations(idsToRetrieve);

    return inventoryOperations.map((inventoryOperation) => this.mapper.toDto(inventoryOperation));
  }
}
