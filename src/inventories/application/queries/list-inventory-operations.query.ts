import { Inject, Injectable } from '@nestjs/common';

import { InventoryOperationDto } from '@/src/inventories/application/dtos/inventory-operation.dto';
import { EntityDtoMapper } from '@/src/inventories/application/mappers/entity-dto.mapper';
import { InventoryOperationEntity } from '@/src/inventories/core/entities/inventory-operation.entity';
import { Inventory } from '@/src/inventories/core/interfaces/Inventory.repository';

@Injectable()
export class ListInventoryOperationsQuery {
  constructor(
    @Inject(Inventory)
    private readonly inventoryRepository: Inventory,
    private readonly mapper: EntityDtoMapper,
  ) {}

  async execute(
    limit?: number,
    inventory_operation_referenced?: string[],
    movement_type?: number[],
    document_reference?: string[],
    created_by?: string[],
    id_inventory_origin?: string[],
    id_inventory_destination?: string[],
    lastIdInventoryOperation?: string,
    lastCreatedAt?: string,
  ): Promise<InventoryOperationDto[]> {
    let limitToUse: number = 1001;

    if (
      lastCreatedAt && lastIdInventoryOperation === undefined ||
      lastCreatedAt === undefined && lastIdInventoryOperation
    ) {
      throw new Error('If consulting a page larger than 1, pagination metadata is required.');
    }

    if (limit) {
      if (limit <= 1000) {
        limitToUse = limit + 1;
      }
    }

    const inventoryOperations: InventoryOperationEntity[] =
      await this.inventoryRepository.listInventoryOperations(
        limitToUse,
        lastCreatedAt,
        lastIdInventoryOperation,
        inventory_operation_referenced,
        movement_type,
        document_reference,
        created_by,
        id_inventory_origin,
        id_inventory_destination,
      );

    return inventoryOperations.map((inventoryOperation) => this.mapper.toDto(inventoryOperation));
  }
}
