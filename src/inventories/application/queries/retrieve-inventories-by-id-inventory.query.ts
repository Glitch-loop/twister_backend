import { Inject, Injectable } from '@nestjs/common';

import { InventoryDto } from '@/src/inventories/application/dtos/inventory.dto';
import { EntityDtoMapper } from '@/src/inventories/application/mappers/entity-dto.mapper';
import { InventoryEntity } from '@/src/inventories/core/entities/inventory.entity';
import { Inventory } from '@/src/inventories/core/interfaces/Inventory.repository';

@Injectable()
export class RetrieveInventoriesByIdInventoryQuery {
  constructor(
    @Inject(Inventory)
    private readonly inventoryRepository: Inventory,
    private readonly mapper: EntityDtoMapper,
  ) {}

  async execute(idInventory: string[]): Promise<InventoryDto[]> {
    const maxIds = 100;
    const idsToRetrieve = idInventory.slice(0, maxIds);

    const inventories: InventoryEntity[] = await this.inventoryRepository.retrieveInventories(idsToRetrieve);

    return inventories.map((inventory) => this.mapper.toDto(inventory));
  }
}
