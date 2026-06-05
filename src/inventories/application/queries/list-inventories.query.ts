import { Inject, Injectable } from '@nestjs/common';

import { InventoryDto } from '@/src/inventories/application/dtos/inventory.dto';
import { EntityDtoMapper } from '@/src/inventories/application/mappers/entity-dto.mapper';
import { InventoryEntity } from '@/src/inventories/core/entities/inventory.entity';
import { Inventory } from '@/src/inventories/core/interfaces/Inventory.repository';

@Injectable()
export class ListInventoriesQuery {
  constructor(
    @Inject(Inventory)
    private readonly inventoryRepository: Inventory,
    private readonly mapper: EntityDtoMapper,
  ) {}

  async execute(
    limit?: number,
    inventory_context?: number[],
    inventory_name?: string[],
    is_active?: number[],
    created_by?: string[],
    assigned_to?: string[],
    assigned_facility?: string[],
    lastIdInventory?: string,
    lastCreatedAt?: string,
  ): Promise<InventoryDto[]> {
    let limitToUse: number = 1001;

    if (lastCreatedAt && lastIdInventory === undefined || lastCreatedAt === undefined && lastIdInventory) {
      throw new Error('If consulting a page larger than 1, pagination metadata is required.');
    }

    if (limit) {
      if (limit <= 1000) {
        limitToUse = limit + 1;
      }
    }

    const inventories: InventoryEntity[] = await this.inventoryRepository.listInventories(
      limitToUse,
      lastCreatedAt,
      lastIdInventory,
      inventory_context,
      inventory_name,
      is_active,
      created_by,
      assigned_to,
      assigned_facility,
    );

    return inventories.map((inventory) => this.mapper.toDto(inventory));
  }
}
