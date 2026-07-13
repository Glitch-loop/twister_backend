// Libraries
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

// Aggregates
import { InventoryOperationAggregate } from '@/src/inventories/core/aggregates/inventory-operation.aggregate';

// Entitites
import { InventoryEntity } from '@/src/inventories/core/entities/inventory.entity';

// Repository
import { InventoryRepository } from '@/src/inventories/core/interfaces/Inventory.repository';

// Entitites
import { ProductEntity } from '@/src/products/core/entities/product.entity';

// Enum
import { PRODUCT_STATUS_ENUM } from '@/src/products/core/enums/product-status.enum';

// Repository
import { ProductRepository } from '@/src/products/core/interfaces/ProductRepository.repository';

// Mappers
import { EntityDtoMapper } from '@/src/inventories/application/mappers/entity-dto.mapper';

// Shared
import { DOMAIN_EVENT_ENUM } from '@/src/shared/core/enums/domain-event.enum';
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

// Errors
import { BusinessRuleException } from '@/src/shared/errors/BusinessRuleException';

interface InventoryOperationDescriptionInput {
	id_inventory_operation_description?: string;
	price_at_moment: number;
	cost_at_moment: number;
	quantity: number;
	id_product: string;
	created_at?: Date;
}

@Injectable()
export class RegisterInventoryOperationBetweenInventoriesCommand {
	constructor(
		@Inject(InventoryRepository) private readonly inventoryRepository: InventoryRepository,
		@Inject(ProductRepository) private readonly productRepository: ProductRepository,
		@Inject(IntegrityRepository) private readonly integrityRepository: IntegrityRepository,
		private readonly eventEmitter: EventEmitter2,
		private readonly mapper: EntityDtoMapper,
	) {}

	async execute(
		id_inventory_origin: string,
		id_inventory_target: string,
		created_by: string,
		inventory_operation_descriptions: InventoryOperationDescriptionInput[],
		id_inventory_operation?: string,
		created_at?: Date,
		latitude?: string,
		longitude?: string,
	): Promise<void> {
		/*
			Note (13-07-26)
			According with the operational process of the business, it is possible
			to make an inventory operation which doesn't have inventory operation 
			descriptions.

			This is possible because there are 2 cases on which this is true:

			- Product devolution (routes):
				It's possible that after a work day the user (vendor) didn't have the 
				necessity of make any product devolution.

			- Final shift inventory (routes):
				It's possible the user (vendor) sold out the product.

			Both cases share they need to be registered in the database as proper 
			inventory operations as part of the end of the shift.
		*/

		// if (inventory_operation_descriptions.length === 0) {
		// 	throw new BusinessRuleException('Inventory operation descriptions are required.');
		// }

		const [originInventory, destinationInventory] = await Promise.all([
			this.retrieveInventoryById(id_inventory_origin),
			this.retrieveInventoryById(id_inventory_target),
		]);

		await this.assertProductsValid(inventory_operation_descriptions);

		const createdAtToUse = created_at ?? new Date();
		const inventoryOperationIdToUse = id_inventory_operation ?? this.integrityRepository.generateUUIDv4();

		const aggregate = new InventoryOperationAggregate(originInventory, destinationInventory);

		aggregate.createInternalInventoryOperation(
			inventoryOperationIdToUse,
			created_by,
			createdAtToUse,
			latitude ? latitude : null,
			longitude ? longitude : null,
		);

		for (const description of inventory_operation_descriptions) {
			aggregate.addInventoryOperationDescription(
				description.id_inventory_operation_description ?? this.integrityRepository.generateUUIDv4(),
				description.price_at_moment,
				description.cost_at_moment,
				description.quantity,
				description.id_product,
				this.integrityRepository.generateUUIDv4(),
				this.integrityRepository.generateUUIDv4(),
				description.created_at ?? createdAtToUse,
			);
		}

		await this.inventoryRepository.CreateInventoryOperation(aggregate.getInventoryOperation());

		const affectedBalanceRecords = aggregate.getAffectedInventoryBalanceRecords();
		for (const balanceRecord of affectedBalanceRecords) {
			await this.inventoryRepository.UpsertInventoryBalance(balanceRecord);
		}

		this.eventEmitter.emit(
			DOMAIN_EVENT_ENUM.INVENTORY_OPERATION_EVENT,
			this.mapper.toDto(aggregate.getInventoryOperation()),
		);
	}

	private async retrieveInventoryById(id_inventory: string): Promise<InventoryEntity> {
		const inventories = await this.inventoryRepository.retrieveInventories([id_inventory]);

		if (inventories.length === 0) {
			throw new BusinessRuleException(`Inventory with id ${id_inventory} does not exist.`);
		}

		return inventories[0];
	}

	private async assertProductsValid(
		inventory_operation_descriptions: InventoryOperationDescriptionInput[],
	): Promise<void> {
		const productIds = Array.from(
			new Set(inventory_operation_descriptions.map((description) => description.id_product)),
		);

		const products = await this.productRepository.retrieveProducts(productIds);
		const productsById = new Map<string, ProductEntity>(
			products.map((product) => [product.id_product, product]),
		);

		for (const productId of productIds) {
			const product = productsById.get(productId);

			if (!product) {
				throw new BusinessRuleException(`Product with id ${productId} does not exist.`);
			}

			if (product.product_status !== PRODUCT_STATUS_ENUM.ACTIVE) {
				throw new BusinessRuleException(
					`Product with id ${productId} is not active and cannot be used in inventory operation.`,
				);
			}
		}
	}
}