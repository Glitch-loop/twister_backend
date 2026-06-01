import { Injectable } from '@nestjs/common';

// Enums
import { ROUTE_TRANSACTION_OPERATION_TYPE } from '@/src/sellings/core/enums/route-transaction-operation-type.enum';
import { TRANSACTION_STATUS_ENUM } from '@/src/sellings/core/enums/route-status.enum';

// Entities
import { TaxEntity } from '@/src/sellings/core/entities/tax.entity';
import { TransactionEntity } from '@/src/sellings/core/entities/transaction.entity';

// Object values
import { PaymentMethodObjectValue } from '@/src/sellings/core/value-objects/payment-method.object-value';
import { PaymentSchemaObjectValue } from '@/src/sellings/core/value-objects/payment-schema.object-value';
import { RouteTransactionOperationTypeObjectValue } from '@/src/sellings/core/value-objects/route-transaction-operation-type.object-value';
import { TaxInTransactionObjectValue } from '@/src/sellings/core/value-objects/tax-in-transaction.object-value';
import { TransactionDescriptionObjectValue } from '@/src/sellings/core/value-objects/transaction-description.object-value';

// Domain objects guards
import { isTaxEntity } from '@/src/sellings/application/guards/entities/tax.guard';
import { isTransactionEntity } from '@/src/sellings/application/guards/entities/transaction.guard';
import { isPaymentMethodObjectValue } from '@/src/sellings/application/guards/object-values/payment-method.guard';
import { isPaymentSchemaObjectValue } from '@/src/sellings/application/guards/object-values/payment-schema.guard';
import { isRouteTransactionOperationTypeObjectValue } from '@/src/sellings/application/guards/object-values/route-transaction-operation-type.guard';
import { isTaxInTransactionObjectValue } from '@/src/sellings/application/guards/object-values/tax-in-transaction.guard';
import { isTransactionDescriptionObjectValue } from '@/src/sellings/application/guards/object-values/transaction-description.guard';

// Dtos
import { PaymentMethodDto } from '@/src/sellings/application/dtos/payment-method.dto';
import { PaymentSchemaDto } from '@/src/sellings/application/dtos/payment-schema.dto';
import { RouteTransactionOperationTypeDto } from '@/src/sellings/application/dtos/route-transaction-operation-type.dto';
import { TaxInTransactionDto } from '@/src/sellings/application/dtos/tax-in-transaction.dto';
import { TaxDto } from '@/src/sellings/application/dtos/tax.dto';
import { TransactionDescriptionDto } from '@/src/sellings/application/dtos/transaction-description.dto';
import { TransactionDto } from '@/src/sellings/application/dtos/transaction.dto';

// Dtos guards
import { isPaymentMethodDto } from '@/src/sellings/application/guards/dtos/payment-method.guard';
import { isPaymentSchemaDto } from '@/src/sellings/application/guards/dtos/payment-schema.guard';
import { isRouteTransactionOperationTypeDto } from '@/src/sellings/application/guards/dtos/route-transaction-operation-type.guard';
import { isTaxInTransactionDto } from '@/src/sellings/application/guards/dtos/tax-in-transaction.guard';
import { isTaxDto } from '@/src/sellings/application/guards/dtos/tax.guard';
import { isTransactionDescriptionDto } from '@/src/sellings/application/guards/dtos/transaction-description.guard';
import { isTransactionDto } from '@/src/sellings/application/guards/dtos/transaction.guard';

@Injectable()
export class EntityDtoMapper {
	// ==================== OVERLOADED FUNCTIONS FOR MAPPING ====================
	// toDomainObject overloads
	toDomainObject(dto: PaymentMethodDto): PaymentMethodObjectValue;
	toDomainObject(dto: PaymentSchemaDto): PaymentSchemaObjectValue;
	toDomainObject(dto: RouteTransactionOperationTypeDto): RouteTransactionOperationTypeObjectValue;
	toDomainObject(dto: TaxInTransactionDto): TaxInTransactionObjectValue;
	toDomainObject(dto: TransactionDescriptionDto): TransactionDescriptionObjectValue;
	toDomainObject(dto: TaxDto): TaxEntity;
	toDomainObject(dto: TransactionDto): TransactionEntity;
	toDomainObject(
		dto:
			| PaymentMethodDto
			| PaymentSchemaDto
			| RouteTransactionOperationTypeDto
			| TaxInTransactionDto
			| TransactionDescriptionDto
			| TaxDto
			| TransactionDto,
	): any {
		if (isPaymentMethodDto(dto)) {
			return this.paymentMethodDtoToDomainObject(dto);
		}
		if (isPaymentSchemaDto(dto)) {
			return this.paymentSchemaDtoToDomainObject(dto);
		}
		if (isRouteTransactionOperationTypeDto(dto)) {
			return this.routeTransactionOperationTypeDtoToDomainObject(dto);
		}
		if (isTaxInTransactionDto(dto)) {
			return this.taxInTransactionDtoToDomainObject(dto);
		}
		if (isTransactionDescriptionDto(dto)) {
			return this.transactionDescriptionDtoToDomainObject(dto);
		}
		if (isTaxDto(dto)) {
			return this.taxDtoToDomainObject(dto);
		}
		if (isTransactionDto(dto)) {
			return this.transactionDtoToDomainObject(dto);
		}

		throw new Error('Invalid input for mapping to domain object');
	}

	// toDto overloads
	toDto(domainObject: PaymentMethodObjectValue): PaymentMethodDto;
	toDto(domainObject: PaymentSchemaObjectValue): PaymentSchemaDto;
	toDto(domainObject: RouteTransactionOperationTypeObjectValue): RouteTransactionOperationTypeDto;
	toDto(domainObject: TaxInTransactionObjectValue): TaxInTransactionDto;
	toDto(domainObject: TransactionDescriptionObjectValue): TransactionDescriptionDto;
	toDto(domainObject: TaxEntity): TaxDto;
	toDto(domainObject: TransactionEntity): TransactionDto;
	toDto(
		domainObject:
			| PaymentMethodObjectValue
			| PaymentSchemaObjectValue
			| RouteTransactionOperationTypeObjectValue
			| TaxInTransactionObjectValue
			| TransactionDescriptionObjectValue
			| TaxEntity
			| TransactionEntity,
	): any {
		if (isPaymentMethodObjectValue(domainObject)) {
			return this.paymentMethodDomainObjectToDto(domainObject);
		}
		if (isPaymentSchemaObjectValue(domainObject)) {
			return this.paymentSchemaDomainObjectToDto(domainObject);
		}
		if (isRouteTransactionOperationTypeObjectValue(domainObject)) {
			return this.routeTransactionOperationTypeDomainObjectToDto(domainObject);
		}
		if (isTaxInTransactionObjectValue(domainObject)) {
			return this.taxInTransactionDomainObjectToDto(domainObject);
		}
		if (isTransactionDescriptionObjectValue(domainObject)) {
			return this.transactionDescriptionDomainObjectToDto(domainObject);
		}
		if (isTaxEntity(domainObject)) {
			return this.taxDomainObjectToDto(domainObject);
		}
		if (isTransactionEntity(domainObject)) {
			return this.transactionDomainObjectToDto(domainObject);
		}

		throw new Error('Invalid input for mapping to dto');
	}

	// ==================== MAPPER METHODS DOMAIN OBJECT to DTO ====================
	private paymentMethodDomainObjectToDto(domainObject: PaymentMethodObjectValue): PaymentMethodDto {
		return new PaymentMethodDto(
			domainObject.id_payment_method,
			domainObject.payment_method_name,
		);
	}

	private paymentSchemaDomainObjectToDto(domainObject: PaymentSchemaObjectValue): PaymentSchemaDto {
		return new PaymentSchemaDto(
			domainObject.id_payment_schema,
			domainObject.payment_schema_type,
		);
	}

	private routeTransactionOperationTypeDomainObjectToDto(
		domainObject: RouteTransactionOperationTypeObjectValue,
	): RouteTransactionOperationTypeDto {
		return new RouteTransactionOperationTypeDto(
			domainObject.id_route_transaction_operation_type,
			domainObject.transcation_operation_type_name,
		);
	}

	private taxInTransactionDomainObjectToDto(domainObject: TaxInTransactionObjectValue): TaxInTransactionDto {
		return new TaxInTransactionDto(
			domainObject.id_tax_in_transaction,
			domainObject.id_transaction,
			domainObject.id_tax,
			domainObject.tax_rate_at_moment_of_transaction,
			domainObject.created_at,
		);
	}

	private transactionDescriptionDomainObjectToDto(
		domainObject: TransactionDescriptionObjectValue,
	): TransactionDescriptionDto {
		return new TransactionDescriptionDto(
			domainObject.id_transaction_description,
			domainObject.price_at_moment,
			domainObject.cost_at_moment,
			domainObject.quantity,
			domainObject.created_at,
			domainObject.id_transaction,
			domainObject.id_transaction_operation_type,
			domainObject.id_product,
		);
	}

	private taxDomainObjectToDto(domainObject: TaxEntity): TaxDto {
		return new TaxDto(
			domainObject.id_tax,
			domainObject.tax_name,
			domainObject.tax_rate,
			domainObject.created_at,
		);
	}

	private transactionDomainObjectToDto(domainObject: TransactionEntity): TransactionDto {
		return new TransactionDto(
			domainObject.id_transaction,
			domainObject.state,
			domainObject.received_amount,
			domainObject.id_invoice_concept,
			domainObject.created_at,
			domainObject.id_work_day,
			this.paymentMethodDomainObjectToDto(domainObject.payment_method),
			this.paymentSchemaDomainObjectToDto(domainObject.payment_schema),
			domainObject.transaction_descriptions.map((description) => this.transactionDescriptionDomainObjectToDto(description)),
			domainObject.id_client,
			domainObject.id_location,
			domainObject.latitude,
			domainObject.longitude,
			domainObject.cfdi,
		);
	}

	// ==================== MAPPER METHODS DTO to DOMAIN OBJECT ====================
	private paymentMethodDtoToDomainObject(dto: PaymentMethodDto): PaymentMethodObjectValue {
		return new PaymentMethodObjectValue(
			dto.id_payment_method,
			dto.payment_method_name,
		);
	}

	private paymentSchemaDtoToDomainObject(dto: PaymentSchemaDto): PaymentSchemaObjectValue {
		return new PaymentSchemaObjectValue(
			dto.id_payment_schema,
			dto.payment_schema_type,
		);
	}

	private routeTransactionOperationTypeDtoToDomainObject(
		dto: RouteTransactionOperationTypeDto,
	): RouteTransactionOperationTypeObjectValue {
		if (!Object.values(ROUTE_TRANSACTION_OPERATION_TYPE).includes(dto.transcation_operation_type_name as ROUTE_TRANSACTION_OPERATION_TYPE)) {
			throw new Error('Invalid transcation_operation_type_name in RouteTransactionOperationTypeDto');
		}

		return new RouteTransactionOperationTypeObjectValue(
			dto.id_route_transaction_operation_type,
			dto.transcation_operation_type_name,
		);
	}

	private taxInTransactionDtoToDomainObject(dto: TaxInTransactionDto): TaxInTransactionObjectValue {
		const createdAt = this.toDate(dto.created_at, 'TaxInTransactionDto.created_at');

		return new TaxInTransactionObjectValue(
			dto.id_tax_in_transaction,
			dto.id_transaction,
			dto.id_tax,
			dto.tax_rate_at_moment_of_transaction,
			createdAt,
		);
	}

	private transactionDescriptionDtoToDomainObject(
		dto: TransactionDescriptionDto,
	): TransactionDescriptionObjectValue {
		const createdAt = this.toDate(dto.created_at, 'TransactionDescriptionDto.created_at');

		if (!Object.values(ROUTE_TRANSACTION_OPERATION_TYPE).includes(dto.id_transaction_operation_type as ROUTE_TRANSACTION_OPERATION_TYPE)) {
			throw new Error('Invalid id_transaction_operation_type in TransactionDescriptionDto');
		}

		return new TransactionDescriptionObjectValue(
			dto.id_transaction_description,
			dto.price_at_moment,
			dto.cost_at_moment,
			dto.quantity,
			createdAt,
			dto.id_transaction,
			dto.id_transaction_operation_type as ROUTE_TRANSACTION_OPERATION_TYPE,
			dto.id_product,
		);
	}

	private taxDtoToDomainObject(dto: TaxDto): TaxEntity {
		const createdAt = this.toDate(dto.created_at, 'TaxDto.created_at');

		return new TaxEntity(
			dto.id_tax,
			dto.tax_name,
			dto.tax_rate,
			createdAt,
		);
	}

	private transactionDtoToDomainObject(dto: TransactionDto): TransactionEntity {
		const createdAt = this.toDate(dto.created_at, 'TransactionDto.created_at');

		if (!Object.values(TRANSACTION_STATUS_ENUM).includes(dto.state)) {
			throw new Error('Invalid state in TransactionDto');
		}

		if (typeof dto.latitude !== 'string' || typeof dto.longitude !== 'string') {
			throw new Error('TransactionDto latitude and longitude are required for domain conversion');
		}

		if (typeof dto.id_client !== 'string') {
			throw new Error('TransactionDto id_client is required for domain conversion');
		}

		return new TransactionEntity(
			dto.id_transaction,
			dto.state,
			dto.received_amount,
			dto.id_invoice_concept,
			dto.latitude,
			dto.longitude,
			createdAt,
			dto.id_client,
			dto.id_work_day,
			this.paymentMethodDtoToDomainObject(dto.payment_method),
			this.paymentSchemaDtoToDomainObject(dto.payment_schema),
			dto.transaction_descriptions.map((description) => this.transactionDescriptionDtoToDomainObject(description)),
			dto.cfdi,
			dto.id_location,
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
