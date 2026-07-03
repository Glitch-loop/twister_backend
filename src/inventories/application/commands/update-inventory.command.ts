// Libraries
import { Inject, Injectable } from '@nestjs/common';

// Repository
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

// Aggregate
import { InventoryAggregate } from '@/src/inventories/core/aggregates/inventory.aggregate';

// Object value
import { InventoryBalanceObjectValue } from '@/src/inventories/core/value-objects/inventory-balance.object-value';

// Entities
import { InventoryEntity } from '@/src/inventories/core/entities/inventory.entity';
import { InventoryRepository } from '@/src/inventories/core/interfaces/Inventory.repository';


interface ProductLimitsInterface {
	id_product: string;
	min_quantity: number | null;
	max_quantity: number | null;
}

@Injectable()
export class UpdateInventoryCommand {
	constructor(
		@Inject(InventoryRepository) private readonly inventoryRepository: InventoryRepository,
		@Inject(IntegrityRepository) private readonly integrityRepository: IntegrityRepository,
	) {}

	async execute(
		id_inventory: string, 
		inventory_name?: string,
		stock_validation?: number,
		products_limits?: ProductLimitsInterface[] 
	): Promise<void> {
		const inventories: InventoryEntity[] = await this.inventoryRepository.retrieveInventories([id_inventory]);

		if (inventories.length === 0) {
			throw new Error(`Inventory with id ${id_inventory} does not exist.`);
		}

		const aggregate = new InventoryAggregate(inventories[0]);
		const updatedInventory = aggregate.updateInventory(inventory_name, stock_validation);
		
		if(products_limits) {
			for (const productLimit of products_limits) {
				const { id_product, min_quantity, max_quantity} = productLimit;
				aggregate.establishLimitsForInventoryBalance(id_product, min_quantity, max_quantity, this.integrityRepository.generateUUIDv4());
			}
			const affectedInventoryBalanceRecords: InventoryBalanceObjectValue[] = aggregate.getAffectedInventoryBalance();
			for (const inventoryBalance of affectedInventoryBalanceRecords) {
				await this.inventoryRepository.UpsertInventoryBalance(inventoryBalance);
			}
		}

		await this.inventoryRepository.UpdateInventory(updatedInventory);
	}
}