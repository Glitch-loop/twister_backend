// Libraries
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

// Aggregates
import { InventoryOperationAggregate } from '@/src/inventories/core/aggregates/inventory-operation.aggregate';

// Entitites
import { InventoryEntity } from '@/src/inventories/core/entities/inventory.entity';
import { InventoryOperationEntity } from '@/src/inventories/core/entities/inventory-operation.entity';
import { ProductEntity } from '@/src/products/core/entities/product.entity';

// Repository
import { InventoryRepository } from '@/src/inventories/core/interfaces/Inventory.repository';

// Errors
import { BusinessRuleException } from '@/src/shared/errors/BusinessRuleException';

// Enum
import { PRODUCT_STATUS_ENUM } from '@/src/products/core/enums/product-status.enum';

// Mappers
import { EntityDtoMapper } from '@/src/inventories/application/mappers/entity-dto.mapper'

// Shared
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';
import { ProductRepository } from '@/src/products/core/interfaces/ProductRepository.repository';
import { DOMAIN_EVENT_ENUM } from '@/src/shared/core/enums/domain-event.enum';
import { INVENTORY_CONTEXT_ENUM } from '../../core/enums/inventory-context.enum';

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
		@Inject(InventoryRepository) private readonly inventoryRepository: InventoryRepository,
		@Inject(ProductRepository) private readonly productRepository: ProductRepository,
		@Inject(IntegrityRepository) private readonly integrityRepository: IntegrityRepository,
		private readonly eventEmitter: EventEmitter2,
		private readonly mapper: EntityDtoMapper
	) {}

	async execute(
		id_inventory_operation_to_reverse: string,
		created_by: string,
		created_at?: Date,
		id_inventory_operation?: string,
		latitude?: string,
		longitude?: string
	): Promise<void> {
		const inventoryOperationToReverse: InventoryOperationEntity = await this.retrieveInventoryOperationById(id_inventory_operation_to_reverse);
		const idInventoryOriginOfOperationToReverse = inventoryOperationToReverse.id_inventory_origin
		const idInventoryTargetOfOperationToReverse = inventoryOperationToReverse.id_inventory_target
		const { inventory_operation_descriptions } = inventoryOperationToReverse

		await this.assertInventoryOperationNotPreviouslyReversed(id_inventory_operation_to_reverse);
		this.assertRequestedInventoriesMatchOperationToReverse(
			inventoryOperationToReverse,
			idInventoryOriginOfOperationToReverse,
			idInventoryTargetOfOperationToReverse,
		);

		await this.assertProductsValid(inventory_operation_descriptions);

		const originInventoryOfOperationToReverse = await this.retrieveInventoryById(idInventoryOriginOfOperationToReverse);
		const targetInventoryOfOperationToReverse = await this.retrieveInventoryById(idInventoryTargetOfOperationToReverse);
		await this.assertInventoryOperationToReverseIsLastForInvolvedInventories(inventoryOperationToReverse, originInventoryOfOperationToReverse, targetInventoryOfOperationToReverse);

		const createdAtToUse = created_at ?? new Date();
		const inventoryOperationIdToUse = id_inventory_operation ?? this.integrityRepository.generateUUIDv4();

		const aggregate = new InventoryOperationAggregate(targetInventoryOfOperationToReverse, originInventoryOfOperationToReverse);

		aggregate.reverseInventoryOperation(
			inventoryOperationIdToUse,
			created_by,
			createdAtToUse,
			inventoryOperationToReverse,
			latitude ? latitude : null,
			longitude ? longitude : null,
		);

		for (const description of inventory_operation_descriptions) {
			aggregate.addInventoryOperationDescription(
				this.integrityRepository.generateUUIDv4(),
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
			this.mapper.toDto(aggregate.getInventoryOperation())
		);
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

	private assertRequestedInventoriesMatchOperationToReverse(
		inventoryOperationToReverse: InventoryOperationEntity,
		id_inventory_origin: string,
		id_inventory_target: string,
	): void {
		if (
			inventoryOperationToReverse.id_inventory_origin !== id_inventory_origin
			|| inventoryOperationToReverse.id_inventory_target !== id_inventory_target
		) {
			throw new BusinessRuleException(
				`Inventory operation ${inventoryOperationToReverse.id_inventory_operation} does not belong to the requested inventory route ${id_inventory_origin} -> ${id_inventory_target}.`,
			);
		}
	}

	private async assertInventoryOperationToReverseIsLastForInvolvedInventories(
		inventoryOperationToReverse: InventoryOperationEntity,
		originInventory: InventoryEntity, 
		targetInventory: InventoryEntity
	): Promise<void> {

		if (originInventory.inventory_context === INVENTORY_CONTEXT_ENUM.AVAILABLE_FOR_SALE 
		&& targetInventory.inventory_context === INVENTORY_CONTEXT_ENUM.CLIENT_VIRTUAL) {
			/*
				Design notes (07-18-26)

				This is valid at any time because the user has the freedom for go back to the user
				once the user has been visted previously.

				The unique constraint should be that if the user tries to cancel a inventory 
				operation of a finished workday. This is not possible since that workday has been
				completed.
			*/
			return;
		}

		const { id_inventory_origin, id_inventory_target, id_inventory_operation } = inventoryOperationToReverse;

		const involvedInventoryIds = new Set<string>([id_inventory_origin, id_inventory_target]);

		for (const id_inventory of involvedInventoryIds) {
			const latestOperation = await this.retrieveLatestOperationForInventory(id_inventory);

			if (latestOperation && latestOperation.id_inventory_operation !== id_inventory_operation) {
				throw new BusinessRuleException(
					`Inventory operation ${id_inventory_operation} cannot be reversed because it is not the latest operation affecting inventory ${id_inventory}. Latest operation is ${latestOperation.id_inventory_operation}.`,
				);
			}
		}
	}

	private async retrieveLatestOperationForInventory(
		id_inventory: string,
	): Promise<InventoryOperationEntity | undefined> {
		const [latestAsOrigin, latestAsTarget] = await Promise.all([
			this.inventoryRepository.listInventoryOperations(
				1,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				[id_inventory],
				undefined,
			),
			this.inventoryRepository.listInventoryOperations(
				1,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				[id_inventory],
			),
		]);

		const latestOriginOperation = latestAsOrigin[0];
		const latestTargetOperation = latestAsTarget[0];

		if (!latestOriginOperation) {
			return latestTargetOperation;
		}

		if (!latestTargetOperation) {
			return latestOriginOperation;
		}

		const latestOriginOperationDate = new Date(latestOriginOperation.created_at).getTime();
		const latestTargetOperationDate = new Date(latestTargetOperation.created_at).getTime();

		if (latestOriginOperationDate > latestTargetOperationDate) {
			return latestOriginOperation;
		}

		if (latestTargetOperationDate > latestOriginOperationDate) {
			return latestTargetOperation;
		}

		return latestOriginOperation.id_inventory_operation > latestTargetOperation.id_inventory_operation
			? latestOriginOperation
			: latestTargetOperation;
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