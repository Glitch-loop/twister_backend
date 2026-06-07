import { Injectable } from '@nestjs/common';

// Enums
import { INVENTORY_CONTEXT_ENUM } from '@/src/inventories/core/enums/inventory-context.enum';
import { INVENTORY_STATE_ENUM } from '@/src/inventories/core/enums/inventory-state-enum';
import { MOVEMENT_TYPE_ENUM } from '@/src/inventories/core/enums/movement-type.enum';

// Entities
import { InventoryEntity } from '@/src/inventories/core/entities/inventory.entity';
import { InventoryOperationEntity } from '@/src/inventories/core/entities/inventory-operation.entity';

// Object values
import { InventoryBalanceObjectValue } from '@/src/inventories/core/value-objects/inventory-balance.object-value';
import { InventoryOperationDescriptionObjectValue } from '@/src/inventories/core/value-objects/inventory-operation-description.object-value';

// Models
import type { InventoryModel } from '@/src/inventories/application/models/inventory.model';
import type { InventoryOperationModel } from '@/src/inventories/application/models/inventory-operation.model';
import type { InventoryBalanceModel } from '@/src/inventories/application/models/inventory-balance.model';
import type { InventoryOperationDescriptionModel } from '@/src/inventories/application/models/inventory-operation-description.model';

// Entity guards
import { isInventoryEntity } from '@/src/inventories/application/guards/entities/inventory.guard';
import { isInventoryOperationEntity } from '@/src/inventories/application/guards/entities/inventory-operation.guard';

// Model guards
import { isInventoryModel } from '@/src/inventories/application/guards/models/inventory.guard';
import { isInventoryOperationModel } from '@/src/inventories/application/guards/models/inventory-operation.guard';
import { isInventoryBalanceModel } from '@/src/inventories/application/guards/object-values/inventory-balance.guard';
import { isInventoryOperationDescriptionModel } from '@/src/inventories/application/guards/object-values/inventory-operation-description.guard';

@Injectable()
export class EntityModelMapper {
	// ==================== OVERLOADED FUNCTIONS FOR MAPPING ====================
	// toDomainObject overloads
	toDomainObject(model: InventoryBalanceModel): InventoryBalanceObjectValue;
	toDomainObject(model: InventoryOperationDescriptionModel): InventoryOperationDescriptionObjectValue;
	toDomainObject(model: InventoryModel, inventoryBalanceModels: InventoryBalanceModel[]): InventoryEntity;
	toDomainObject(
		model: InventoryOperationModel,
		inventoryOperationDescriptionModels: InventoryOperationDescriptionModel[],
	): InventoryOperationEntity;
	toDomainObject(
		model:
			| InventoryBalanceModel
			| InventoryOperationDescriptionModel
			| InventoryModel
			| InventoryOperationModel,
		nestedModels?: InventoryBalanceModel[] | InventoryOperationDescriptionModel[],
	): any {
		if (isInventoryBalanceModel(model)) {
			return this.inventoryBalanceModelToDomainObject(model);
		}
		if (isInventoryOperationDescriptionModel(model)) {
			return this.inventoryOperationDescriptionModelToDomainObject(model);
		}
		if (isInventoryModel(model)) {
			if (Array.isArray(nestedModels) && nestedModels.every(isInventoryBalanceModel)) {
				return this.inventoryModelToDomainObject(model, nestedModels);
			}
			throw new Error('Missing inventory balance models for InventoryModel to domain object conversion');
		}
		if (isInventoryOperationModel(model)) {
			if (Array.isArray(nestedModels) && nestedModels.every(isInventoryOperationDescriptionModel)) {
				return this.InventoryOperationModelToDomainObject(model, nestedModels);
			}
			throw new Error(
				'Missing inventory operation description models for InventoryOperationModel to domain object conversion',
			);
		}

		throw new Error('Invalid input for mapping to domain object');
	}

	// toModel overloads
	toModel(domainObject: InventoryBalanceObjectValue): InventoryBalanceModel;
	toModel(domainObject: InventoryOperationDescriptionObjectValue): InventoryOperationDescriptionModel;
	toModel(domainObject: InventoryEntity): InventoryModel;
	toModel(domainObject: InventoryOperationEntity): InventoryOperationModel;
	toModel(
		domainObject:
			| InventoryBalanceObjectValue
			| InventoryOperationDescriptionObjectValue
			| InventoryEntity
			| InventoryOperationEntity,
	): any {
		if (isInventoryEntity(domainObject)) {
			return this.inventoryEntityToModel(domainObject);
		}
		if (isInventoryOperationEntity(domainObject)) {
			return this.InventoryOperationEntityToModel(domainObject);
		}
		if (isInventoryBalanceModel(domainObject)) {
			return this.inventoryBalanceObjectValueToModel(domainObject);
		}
		if (isInventoryOperationDescriptionModel(domainObject)) {
			return this.inventoryOperationDescriptionObjectValueToModel(
				domainObject,
			);
		}

		throw new Error('Invalid input for mapping to model');
	}

	// ==================== MAPPER METHODS DOMAIN OBJECT to MODEL ====================
	private inventoryBalanceObjectValueToModel(domainObject: InventoryBalanceObjectValue): InventoryBalanceModel {
		return {
			id_inventory_balance: domainObject.id_inventory_balance,
			quantity: domainObject.quantity,
			created_at: domainObject.created_at,
			id_inventory: domainObject.id_inventory,
			id_product: domainObject.id_product,
		};
	}

	private inventoryOperationDescriptionObjectValueToModel(
		domainObject: InventoryOperationDescriptionObjectValue,
	): InventoryOperationDescriptionModel {
		return {
			id_inventory_operation_description: domainObject.id_inventory_operation_description,
			price_at_moment: domainObject.price_at_moment,
			cost_at_moment: domainObject.cost_at_moment,
			quantity: domainObject.quantity,
			created_at: domainObject.created_at,
			id_inventory_operation: domainObject.id_inventory_operation,
			id_product: domainObject.id_product,
		};
	}

	private inventoryEntityToModel(domainObject: InventoryEntity): InventoryModel {
		return {
			id_inventory: domainObject.id_inventory,
			inventory_context: domainObject.inventory_context,
			inventory_name: domainObject.inventory_name,
			is_active: domainObject.is_active,
			stock_validation: domainObject.stock_validation,
			created_at: domainObject.created_at,
			updated_at: domainObject.updated_at,
			created_by: domainObject.created_by,
			assigned_facility: domainObject.assigned_facility,
			assigned_to: domainObject.assigned_to,
		};
	}

	private InventoryOperationEntityToModel(domainObject: InventoryOperationEntity): InventoryOperationModel {
		return {
			id_inventory_operation: domainObject.id_inventory_operation,
			latitude: domainObject.latitude,
			longitude: domainObject.longitude,
			inventory_operation_reference: domainObject.inventory_operation_reference,
			movement_type: domainObject.movement_type,
			document_reference: domainObject.document_reference,
			created_at: domainObject.created_at,
			created_by: domainObject.created_by,
			id_inventory_origin: domainObject.id_inventory_origin,
			id_inventory_target: domainObject.id_inventory_target,
		};
	}

	// ==================== MAPPER METHODS MODEL to DOMAIN OBJECT ====================
	private inventoryBalanceModelToDomainObject(model: InventoryBalanceModel): InventoryBalanceObjectValue {
		const createdAt = this.toDate(model.created_at, 'InventoryBalanceModel.created_at');

		return new InventoryBalanceObjectValue(
			model.id_inventory_balance,
			model.quantity,
			createdAt,
			model.id_inventory,
			model.id_product,
		);
	}

	private inventoryOperationDescriptionModelToDomainObject(
		model: InventoryOperationDescriptionModel,
	): InventoryOperationDescriptionObjectValue {
		const createdAt = this.toDate(
			model.created_at,
			'InventoryOperationDescriptionModel.created_at',
		);

		return new InventoryOperationDescriptionObjectValue(
			model.id_inventory_operation_description,
			model.price_at_moment,
			model.cost_at_moment,
			model.quantity,
			createdAt,
			model.id_inventory_operation,
			model.id_product,
		);
	}

	private inventoryModelToDomainObject(
		model: InventoryModel,
		inventoryBalanceModels: InventoryBalanceModel[],
	): InventoryEntity {
		const updatedAt = this.toDate(model.updated_at, 'InventoryModel.updated_at');
		const createdAt = this.toDate(model.created_at, 'InventoryModel.created_at');

		if (!Object.values(INVENTORY_CONTEXT_ENUM).includes(model.inventory_context)) {
			throw new Error('Invalid inventory_context in InventoryModel');
		}

		if (!Object.values(INVENTORY_STATE_ENUM).includes(model.is_active)) {
			throw new Error('Invalid is_active in InventoryModel');
		}

		return new InventoryEntity(
			model.id_inventory,
			model.inventory_context,
			model.inventory_name,
			model.is_active,
			model.stock_validation,
			createdAt,
			updatedAt,
			model.created_by,
			inventoryBalanceModels.map((balance) => this.inventoryBalanceModelToDomainObject(balance)),
			model.assigned_facility,
			model.assigned_to,
		);
	}

	private InventoryOperationModelToDomainObject(
		model: InventoryOperationModel,
		inventoryOperationDescriptionModels: InventoryOperationDescriptionModel[],
	): InventoryOperationEntity {
		const createdAt = this.toDate(model.created_at, 'InventoryOperationModel.created_at');

		if (!Object.values(MOVEMENT_TYPE_ENUM).includes(model.movement_type)) {
			throw new Error('Invalid movement_type in InventoryOperationModel');
		}

		return new InventoryOperationEntity(
			model.id_inventory_operation,
			model.latitude,
			model.longitude,
			model.movement_type,
			createdAt,
			model.created_by,
			model.id_inventory_origin,
			model.id_inventory_target,
			inventoryOperationDescriptionModels.map((desc) =>
				this.inventoryOperationDescriptionModelToDomainObject(desc),
			),
			model.inventory_operation_reference,
			model.document_reference,
		);
	}

	private toDate(value: Date | string, fieldName: string): Date {
		const parsedDate = value instanceof Date ? value : new Date(value);

		if (isNaN(parsedDate.getTime())) {
			throw new Error(`Invalid ${fieldName} format`);
		}

		return parsedDate;
	}
}
