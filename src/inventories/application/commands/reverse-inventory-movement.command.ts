import { Inject, Injectable } from '@nestjs/common';

import { InventoryOperationAggregate } from '@/src/inventories/core/aggregates/inventory-operation.aggregate';
import { InventoryEntity } from '@/src/inventories/core/entities/inventory.entity';
import { InventoryOperationEntity } from '@/src/inventories/core/entities/inventory-operation.entity';
import { Inventory } from '@/src/inventories/core/interfaces/Inventory.repository';
import { ProductEntity } from '@/src/products/core/entities/product.entity';
import { PRODUCT_STATUS_ENUM } from '@/src/products/core/enums/product-status.enum';
import { ProductRepository } from '@/src/products/core/interfaces/ProductRepository.repository';
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';
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
export class ReverseInventoryMovementCommand {
	constructor(
		@Inject(Inventory) private readonly inventoryRepository: Inventory,
		@Inject(ProductRepository) private readonly productRepository: ProductRepository,
		@Inject(IntegrityRepository) private readonly integrityRepository: IntegrityRepository,
	) {}

	async execute(
		id_inventory_origin: string,
		id_inventory_target: string,
		id_inventory_operation_to_reverse: string,
		created_by: string,
		inventory_operation_descriptions: InventoryOperationDescriptionInput[],
		id_inventory_operation?: string,
		created_at?: Date,
		latitude?: string,
		longitude?: string,
	): Promise<void> {
		if (inventory_operation_descriptions.length === 0) {
			throw new BusinessRuleException('Inventory operation descriptions are required.');
		}

		const [originInventory, destinationInventory, inventoryOperationToReverse] = await Promise.all([
			this.retrieveInventoryById(id_inventory_origin),
			this.retrieveInventoryById(id_inventory_target),
			this.retrieveInventoryOperationById(id_inventory_operation_to_reverse),
		]);

		await this.assertInventoryOperationNotPreviouslyReversed(id_inventory_operation_to_reverse);
		await this.assertProductsValid(inventory_operation_descriptions);

		const createdAtToUse = created_at ?? new Date();
		const inventoryOperationIdToUse = id_inventory_operation ?? this.integrityRepository.generateUUIDv4();

		const aggregate = new InventoryOperationAggregate(originInventory, destinationInventory);

		aggregate.reverseInventoryOperation(
			inventoryOperationIdToUse,
			created_by,
			createdAtToUse,
			inventoryOperationToReverse,
			latitude,
			longitude,
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
	}

	private async retrieveInventoryById(id_inventory: string): Promise<InventoryEntity> {
		const inventories = await this.inventoryRepository.retrieveInventories([id_inventory]);

		if (inventories.length === 0) {
			throw new BusinessRuleException(`Inventory with id ${id_inventory} does not exist.`);
		}

		return inventories[0];
	}

	private async retrieveInventoryOperationById(
		id_inventory_operation: string,
	): Promise<InventoryOperationEntity> {
		const inventoryOperations = await this.inventoryRepository.retrieveInventoryOperations([
			id_inventory_operation,
		]);

		if (inventoryOperations.length === 0) {
			throw new BusinessRuleException(
				`Inventory operation with id ${id_inventory_operation} does not exist and cannot be reversed.`,
			);
		}

		return inventoryOperations[0];
	}

	private async assertInventoryOperationNotPreviouslyReversed(
		id_inventory_operation_to_reverse: string,
	): Promise<void> {
		const reversedOperations = await this.inventoryRepository.listInventoryOperations(
			1,
			undefined,
			undefined,
			[id_inventory_operation_to_reverse],
		);

		if (reversedOperations.length > 0) {
			throw new BusinessRuleException(
				`Inventory operation with id ${id_inventory_operation_to_reverse} has already been reversed.`,
			);
		}
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