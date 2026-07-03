import { Inject, Injectable } from '@nestjs/common';

import { InventoryAggregate } from '@/src/inventories/core/aggregates/inventory.aggregate';
import { InventoryEntity } from '@/src/inventories/core/entities/inventory.entity';
import { InventoryRepository } from '@/src/inventories/core/interfaces/Inventory.repository';

@Injectable()
export class DeactiveInventoryCommand {
	constructor(
		@Inject(InventoryRepository) private readonly inventoryRepository: InventoryRepository,
	) {}

	async execute(id_inventory: string): Promise<void> {
		const inventories: InventoryEntity[] = await this.inventoryRepository.retrieveInventories([id_inventory]);

		if (inventories.length === 0) {
			throw new Error(`Inventory with id ${id_inventory} does not exist.`);
		}

		const aggregate = new InventoryAggregate(inventories[0]);
		const deactivatedInventory = aggregate.deactivateInventory();

		await this.inventoryRepository.UpdateInventory(deactivatedInventory);
	}
}
