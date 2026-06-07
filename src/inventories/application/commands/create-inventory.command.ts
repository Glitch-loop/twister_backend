// Libraries
import { Inject, Injectable } from '@nestjs/common';

// Repositories
import { Inventory } from '@/src/inventories/core/interfaces/Inventory.repository';

// Aggregate
import { InventoryAggregate } from '@/src/inventories/core/aggregates/inventory.aggregate';

// Enums
import { INVENTORY_CONTEXT_ENUM } from '@/src/inventories/core/enums/inventory-context.enum';
import { STOCK_VALIDATION_ENUM } from '@/src/inventories/core/enums/stock-validation.enum';

// Entities
import { InventoryEntity } from '@/src/inventories/core/entities/inventory.entity';

// Shared
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

@Injectable()
export class CreateInventoryCommand {
	constructor(
		@Inject(Inventory) private readonly inventoryRepository: Inventory,
		@Inject(IntegrityRepository) private readonly integrityRepository: IntegrityRepository,
	) {}

	async execute(
		inventory_context: INVENTORY_CONTEXT_ENUM,
		inventory_name: string,
		created_by: string,
		stock_validation?: STOCK_VALIDATION_ENUM,
		assigned_to?: string,
		assigned_facility?: string,
		id_inventory?: string,
	): Promise<void> {
		const aggregate = new InventoryAggregate(null);

		const newInventory: InventoryEntity = aggregate.createNewInventory(
			id_inventory ?? this.integrityRepository.generateUUIDv4(),
			inventory_context,
			stock_validation ? stock_validation : STOCK_VALIDATION_ENUM.ENABLE, 
			inventory_name.trim(),
			created_by,
			assigned_to,
			assigned_facility,
		);

		await this.inventoryRepository.CreateInventory(newInventory);
	}
}
