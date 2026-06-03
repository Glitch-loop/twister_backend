import { Injectable } from '@nestjs/common';

// Enums
import { INVENTORY_CONTEXT_ENUM } from '@/src/inventory/core/enums/inventory-context.enum';
import { INVENTORY_STATE_ENUM } from '@/src/inventory/core/enums/inventory-state-enum';
import { MOVEMENT_TYPE_ENUM } from '@/src/inventory/core/enums/movement-type.enum';

// Entities
import { InventoryEntity } from '@/src/inventory/core/entities/inventory.entity';
import { InventoryOperationsEntity } from '@/src/inventory/core/entities/inventory-operations.entity';

// Object values
import { InventoryBalanceObjectValue } from '@/src/inventory/core/value-objects/inventory-balance.object-value';
import { InventoryOperationDescriptionObjectValue } from '@/src/inventory/core/value-objects/inventory-operation-description.object-value';

// Dtos
import { InventoryDto } from '@/src/inventory/application/dtos/inventory.dto';
import { InventoryOperationsDto } from '@/src/inventory/application/dtos/inventory-operations.dto';
import { InventoryBalanceDto } from '@/src/inventory/application/dtos/inventory-balance.dto';
import { InventoryOperationDescriptionDto } from '@/src/inventory/application/dtos/inventory-operation-description.dto';

// Entity guards
import { isInventoryEntity } from '@/src/inventory/application/guards/entities/inventory.guard';
import { isInventoryOperationsEntity } from '@/src/inventory/application/guards/entities/inventory-operations.guard';

// Object-value guards (structurally equivalent to model guards, used for OV dispatch)
import { isInventoryBalanceModel } from '@/src/inventory/application/guards/object-values/inventory-balance.guard';
import { isInventoryOperationDescriptionModel } from '@/src/inventory/application/guards/object-values/inventory-operation-description.guard';

// Dto guards
import { isInventoryDto } from '@/src/inventory/application/guards/dtos/inventory.guard';
import { isInventoryOperationsDto } from '@/src/inventory/application/guards/dtos/inventory-operations.guard';
import { isInventoryBalanceDto } from '@/src/inventory/application/guards/dtos/inventory-balance.guard';
import { isInventoryOperationDescriptionDto } from '@/src/inventory/application/guards/dtos/inventory-operation-description.guard';

@Injectable()
export class EntityDtoMapper {
	// ==================== OVERLOADED FUNCTIONS FOR MAPPING ====================
	// toDomainObject overloads
	toDomainObject(dto: InventoryBalanceDto): InventoryBalanceObjectValue;
	toDomainObject(dto: InventoryOperationDescriptionDto): InventoryOperationDescriptionObjectValue;
	toDomainObject(dto: InventoryDto): InventoryEntity;
	toDomainObject(dto: InventoryOperationsDto): InventoryOperationsEntity;
	toDomainObject(
		dto:
			| InventoryBalanceDto
			| InventoryOperationDescriptionDto
			| InventoryDto
			| InventoryOperationsDto,
	): any {
		if (isInventoryBalanceDto(dto)) {
			return this.inventoryBalanceDtoToDomainObject(dto);
		}
		if (isInventoryOperationDescriptionDto(dto)) {
			return this.inventoryOperationDescriptionDtoToDomainObject(dto);
		}
		if (isInventoryDto(dto)) {
			return this.inventoryDtoToDomainObject(dto);
		}
		if (isInventoryOperationsDto(dto)) {
			return this.inventoryOperationsDtoToDomainObject(dto);
		}

		throw new Error('Invalid input for mapping to domain object');
	}

	// toDto overloads
	toDto(domainObject: InventoryBalanceObjectValue): InventoryBalanceDto;
	toDto(domainObject: InventoryOperationDescriptionObjectValue): InventoryOperationDescriptionDto;
	toDto(domainObject: InventoryEntity): InventoryDto;
	toDto(domainObject: InventoryOperationsEntity): InventoryOperationsDto;
	toDto(
		domainObject:
			| InventoryBalanceObjectValue
			| InventoryOperationDescriptionObjectValue
			| InventoryEntity
			| InventoryOperationsEntity,
	): any {
		if (isInventoryEntity(domainObject)) {
			return this.inventoryEntityToDto(domainObject);
		}
		if (isInventoryOperationsEntity(domainObject)) {
			return this.inventoryOperationsEntityToDto(domainObject);
		}
		if (isInventoryBalanceModel(domainObject)) {
			return this.inventoryBalanceObjectValueToDto(domainObject);
		}
		if (isInventoryOperationDescriptionModel(domainObject)) {
			return this.inventoryOperationDescriptionObjectValueToDto(
				domainObject,
			);
		}

		throw new Error('Invalid input for mapping to dto');
	}

	// ==================== MAPPER METHODS DOMAIN OBJECT to DTO ====================
	private inventoryBalanceObjectValueToDto(domainObject: InventoryBalanceObjectValue): InventoryBalanceDto {
		return new InventoryBalanceDto(
			domainObject.id_inventory_balance,
			domainObject.quantity,
			domainObject.created_at,
			domainObject.id_location_inventory,
			domainObject.id_product,
		);
	}

	private inventoryOperationDescriptionObjectValueToDto(
		domainObject: InventoryOperationDescriptionObjectValue,
	): InventoryOperationDescriptionDto {
		return new InventoryOperationDescriptionDto(
			domainObject.id_product_operation_description,
			domainObject.price_at_moment,
			domainObject.cost_at_moment,
			domainObject.quantity,
			domainObject.created_at,
			domainObject.id_inventory_operation,
			domainObject.id_product,
		);
	}

	private inventoryEntityToDto(domainObject: InventoryEntity): InventoryDto {
		return new InventoryDto(
			domainObject.id_inventory,
			domainObject.inventory_context,
			domainObject.inventory_name,
			domainObject.is_active,
			domainObject.updated_at,
			domainObject.created_at,
			domainObject.created_by,
			domainObject.inventory_balance.map((balance) => this.inventoryBalanceObjectValueToDto(balance)),
			domainObject.assigned_facility,
			domainObject.assigned_factory,
		);
	}

	private inventoryOperationsEntityToDto(domainObject: InventoryOperationsEntity): InventoryOperationsDto {
		return new InventoryOperationsDto(
			domainObject.id_inventory_operation,
			domainObject.movement_type,
			domainObject.created_at,
			domainObject.created_by,
			domainObject.id_inventory_origin,
			domainObject.id_inventory_destination,
			domainObject.inventory_operation_descriptions.map((desc) =>
				this.inventoryOperationDescriptionObjectValueToDto(desc),
			),
			domainObject.latitude,
			domainObject.longitude,
			domainObject.inventory_operation_reference,
			domainObject.document_reference,
		);
	}

	// ==================== MAPPER METHODS DTO to DOMAIN OBJECT ====================
	private inventoryBalanceDtoToDomainObject(dto: InventoryBalanceDto): InventoryBalanceObjectValue {
		const createdAt = this.toDate(dto.created_at, 'InventoryBalanceDto.created_at');

		return new InventoryBalanceObjectValue(
			dto.id_inventory_balance,
			dto.quantity,
			createdAt,
			dto.id_location_inventory,
			dto.id_product,
		);
	}

	private inventoryOperationDescriptionDtoToDomainObject(
		dto: InventoryOperationDescriptionDto,
	): InventoryOperationDescriptionObjectValue {
		const createdAt = this.toDate(dto.created_at, 'InventoryOperationDescriptionDto.created_at');

		return new InventoryOperationDescriptionObjectValue(
			dto.id_product_operation_description,
			dto.price_at_moment,
			dto.cost_at_moment,
			dto.quantity,
			createdAt,
			dto.id_inventory_operation,
			dto.id_product,
		);
	}

	private inventoryDtoToDomainObject(dto: InventoryDto): InventoryEntity {
		const updatedAt = this.toDate(dto.updated_at, 'InventoryDto.updated_at');
		const createdAt = this.toDate(dto.created_at, 'InventoryDto.created_at');

		if (!Object.values(INVENTORY_CONTEXT_ENUM).includes(dto.inventory_context)) {
			throw new Error('Invalid inventory_context in InventoryDto');
		}

		if (!Object.values(INVENTORY_STATE_ENUM).includes(dto.is_active)) {
			throw new Error('Invalid is_active in InventoryDto');
		}

		return new InventoryEntity(
			dto.id_inventory,
			dto.inventory_context,
			dto.inventory_name,
			dto.is_active,
			updatedAt,
			createdAt,
			dto.created_by,
			dto.inventory_balance.map((balance) => this.inventoryBalanceDtoToDomainObject(balance)),
			dto.assigned_facility,
			dto.assigned_factory,
		);
	}

	private inventoryOperationsDtoToDomainObject(dto: InventoryOperationsDto): InventoryOperationsEntity {
		const createdAt = this.toDate(dto.created_at, 'InventoryOperationsDto.created_at');

		if (!Object.values(MOVEMENT_TYPE_ENUM).includes(dto.movement_type)) {
			throw new Error('Invalid movement_type in InventoryOperationsDto');
		}

		return new InventoryOperationsEntity(
			dto.id_inventory_operation,
			dto.latitude ?? null,
			dto.longitude ?? null,
			dto.movement_type,
			createdAt,
			dto.created_by,
			dto.id_inventory_origin,
			dto.id_inventory_destination,
			dto.inventory_operation_descriptions.map((desc) =>
				this.inventoryOperationDescriptionDtoToDomainObject(desc),
			),
			dto.inventory_operation_reference,
			dto.document_reference,
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
