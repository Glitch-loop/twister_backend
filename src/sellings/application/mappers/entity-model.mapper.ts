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

// Guards Domain object
import { isTaxEntity } from '@/src/sellings/application/guards/entities/tax.guard';
import { isTransactionEntity } from '@/src/sellings/application/guards/entities/transaction.guard';
import { isPaymentMethodObjectValue } from '@/src/sellings/application/guards/object-values/payment-method.guard';
import { isPaymentSchemaObjectValue } from '@/src/sellings/application/guards/object-values/payment-schema.guard';
import { isRouteTransactionOperationTypeObjectValue } from '@/src/sellings/application/guards/object-values/route-transaction-operation-type.guard';
import { isTaxInTransactionObjectValue } from '@/src/sellings/application/guards/object-values/tax-in-transaction.guard';
import { isTransactionDescriptionObjectValue } from '@/src/sellings/application/guards/object-values/transaction-description.guard';

// models
import type { PaymentMethodModel } from '@/src/sellings/application/models/payment.method.model';
import type { PaymentSchemaModel } from '@/src/sellings/application/models/payment-schema.model';
import type { RouteTransactionOperationTypeModel } from '@/src/sellings/application/models/route-transaction-operation-type.model';
import type { TaxInTransactionModel } from '@/src/sellings/application/models/tax-in-transaction.model';
import type { TaxModel } from '@/src/sellings/application/models/tax.model';
import type { TransactionDescriptionModel } from '@/src/sellings/application/models/transaction-description.model';
import type { TransactionModel } from '@/src/sellings/application/models/transaction.model';

// Guards models
import { isPaymentMethodModel } from '@/src/sellings/application/guards/models/payment.method.guard';
import { isPaymentSchemaModel } from '@/src/sellings/application/guards/models/payment-schema.guard';
import { isRouteTransactionOperationTypeModel } from '@/src/sellings/application/guards/models/route-transaction-operation-type.guard';
import { isTaxInTransactionModel } from '@/src/sellings/application/guards/models/tax-in-transaction.guard';
import { isTaxModel } from '@/src/sellings/application/guards/models/tax.guard';
import { isTransactionDescriptionModel } from '@/src/sellings/application/guards/models/transaction-description.guard';
import { isTransactionModel } from '@/src/sellings/application/guards/models/transaction.guard';

@Injectable()
export class EntityModelMapper {
	// ==================== OVERLOADED FUNCTIONS FOR MAPPING ====================
	// toDomainObject overloads
	toDomainObject(model: PaymentMethodModel): PaymentMethodObjectValue;
	toDomainObject(model: PaymentSchemaModel): PaymentSchemaObjectValue;
	toDomainObject(model: RouteTransactionOperationTypeModel): RouteTransactionOperationTypeObjectValue;
	toDomainObject(model: TaxInTransactionModel): TaxInTransactionObjectValue;
	toDomainObject(model: TransactionDescriptionModel): TransactionDescriptionObjectValue;
	toDomainObject(model: TaxModel): TaxEntity;
	toDomainObject(
		model: TransactionModel,
		paymentMethodModel: PaymentMethodModel,
		paymentSchemaModel: PaymentSchemaModel,
		transactionDescriptionModels: TransactionDescriptionModel[],
	): TransactionEntity;
	toDomainObject(
		model:
			| PaymentMethodModel
			| PaymentSchemaModel
			| RouteTransactionOperationTypeModel
			| TaxInTransactionModel
			| TransactionDescriptionModel
			| TaxModel
			| TransactionModel,
		paymentMethodModel?: PaymentMethodModel,
		paymentSchemaModel?: PaymentSchemaModel,
		transactionDescriptionModels?: TransactionDescriptionModel[],
	): any {
		if (isPaymentMethodModel(model)) {
			return this.paymentMethodModelToDomainObject(model);
		}
		if (isPaymentSchemaModel(model)) {
			return this.paymentSchemaModelToDomainObject(model);
		}
		if (isRouteTransactionOperationTypeModel(model)) {
			return this.routeTransactionOperationTypeModelToDomainObject(model);
		}
		if (isTaxInTransactionModel(model)) {
			return this.taxInTransactionModelToDomainObject(model);
		}
		if (isTransactionDescriptionModel(model)) {
			return this.transactionDescriptionModelToDomainObject(model);
		}
		if (isTaxModel(model)) {
			return this.taxModelToDomainObject(model);
		}
		if (isTransactionModel(model)) {
			if (
				isPaymentMethodModel(paymentMethodModel) &&
				isPaymentSchemaModel(paymentSchemaModel) &&
				Array.isArray(transactionDescriptionModels) &&
				transactionDescriptionModels.every((description) => isTransactionDescriptionModel(description))
			) {
				return this.transactionModelToDomainObject(
					model,
					paymentMethodModel,
					paymentSchemaModel,
					transactionDescriptionModels,
				);
			}
			throw new Error('Missing nested models for TransactionModel to domain object conversion');
		}

		throw new Error('Invalid input for mapping to domain object');
	}

	// toModel overloads
	toModel(domainObject: PaymentMethodObjectValue): PaymentMethodModel;
	toModel(domainObject: PaymentSchemaObjectValue): PaymentSchemaModel;
	toModel(domainObject: RouteTransactionOperationTypeObjectValue): RouteTransactionOperationTypeModel;
	toModel(domainObject: TaxInTransactionObjectValue): TaxInTransactionModel;
	toModel(domainObject: TransactionDescriptionObjectValue): TransactionDescriptionModel;
	toModel(domainObject: TaxEntity): TaxModel;
	toModel(domainObject: TransactionEntity): TransactionModel;
	toModel(
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
			return this.paymentMethodDomainObjectToModel(domainObject);
		}
		if (isPaymentSchemaObjectValue(domainObject)) {
			return this.paymentSchemaDomainObjectToModel(domainObject);
		}
		if (isRouteTransactionOperationTypeObjectValue(domainObject)) {
			return this.routeTransactionOperationTypeDomainObjectToModel(domainObject);
		}
		if (isTaxInTransactionObjectValue(domainObject)) {
			return this.taxInTransactionDomainObjectToModel(domainObject);
		}
		if (isTransactionDescriptionObjectValue(domainObject)) {
			return this.transactionDescriptionDomainObjectToModel(domainObject);
		}
		if (isTaxEntity(domainObject)) {
			return this.taxEntityToModel(domainObject);
		}
		if (isTransactionEntity(domainObject)) {
			return this.transactionEntityToModel(domainObject);
		}

		throw new Error('Invalid input for mapping to model');
	}

	// ==================== MAPPER METHODS DOMAIN OBJECT to MODEL ====================
	private paymentMethodDomainObjectToModel(domainObject: PaymentMethodObjectValue): PaymentMethodModel {
		return {
			id_payment_method: domainObject.id_payment_method,
			payment_method_name: domainObject.payment_method_name,
		};
	}

	private paymentSchemaDomainObjectToModel(domainObject: PaymentSchemaObjectValue): PaymentSchemaModel {
		return {
			id_payment_schema: domainObject.id_payment_schema,
			payment_schema_type: domainObject.payment_schema_type,
		};
	}

	private routeTransactionOperationTypeDomainObjectToModel(
		domainObject: RouteTransactionOperationTypeObjectValue,
	): RouteTransactionOperationTypeModel {
		return {
			id_route_transaction_operation_type: domainObject.id_route_transaction_operation_type,
			transcation_operation_type_name: domainObject.transcation_operation_type_name,
		};
	}

	private taxInTransactionDomainObjectToModel(domainObject: TaxInTransactionObjectValue): TaxInTransactionModel {
		return {
			id_tax_in_transaction: domainObject.id_tax_in_transaction,
			id_transaction: domainObject.id_transaction,
			id_tax: domainObject.id_tax,
			tax_rate_at_moment_of_transaction: domainObject.tax_rate_at_moment_of_transaction,
			created_at: domainObject.created_at,
		};
	}

	private transactionDescriptionDomainObjectToModel(
		domainObject: TransactionDescriptionObjectValue,
	): TransactionDescriptionModel {
		return {
			id_transaction_description: domainObject.id_transaction_description,
			price_at_moment: domainObject.price_at_moment,
			cost_at_moment: domainObject.cost_at_moment,
			amount: domainObject.amount,
			created_at: domainObject.created_at,
			id_transaction: domainObject.id_transaction,
			id_transaction_operation_type: domainObject.id_transaction_operation_type,
			id_product: domainObject.id_product,
		};
	}

	private taxEntityToModel(domainObject: TaxEntity): TaxModel {
		return {
			id_tax: domainObject.id_tax,
			tax_name: domainObject.tax_name,
			tax_rate: domainObject.tax_rate,
			created_at: domainObject.created_at,
		};
	}

	private transactionEntityToModel(domainObject: TransactionEntity): TransactionModel {
		const paymentMethodModel = this.paymentMethodDomainObjectToModel(domainObject.payment_method);
		const paymentSchemaModel = this.paymentSchemaDomainObjectToModel(domainObject.payment_schema);

		return {
			id_transaction: domainObject.id_transaction,
			cfdi: domainObject.cfdi,
			state: domainObject.state,
			received_amount: domainObject.received_amount,
			id_invoice_concept: domainObject.id_invoice_concept,
			created_at: domainObject.created_at,
			latitude: domainObject.latitude,
			longitude: domainObject.longitude,
			id_location: domainObject.id_location,
			id_client: domainObject.id_client,
			id_work_day: domainObject.id_work_day,
			id_payment_method: paymentMethodModel.id_payment_method,
			id_payment_schema: paymentSchemaModel.id_payment_schema,
		};
	}

	// ==================== MAPPER METHODS MODEL to DOMAIN OBJECT ====================
	private paymentMethodModelToDomainObject(model: PaymentMethodModel): PaymentMethodObjectValue {
		return new PaymentMethodObjectValue(
			model.id_payment_method,
			model.payment_method_name,
		);
	}

	private paymentSchemaModelToDomainObject(model: PaymentSchemaModel): PaymentSchemaObjectValue {
		return new PaymentSchemaObjectValue(
			model.id_payment_schema,
			model.payment_schema_type,
		);
	}

	private routeTransactionOperationTypeModelToDomainObject(
		model: RouteTransactionOperationTypeModel,
	): RouteTransactionOperationTypeObjectValue {
		if (!Object.values(ROUTE_TRANSACTION_OPERATION_TYPE).includes(model.transcation_operation_type_name as ROUTE_TRANSACTION_OPERATION_TYPE)) {
			throw new Error('Invalid transcation_operation_type_name in RouteTransactionOperationTypeModel');
		}

		return new RouteTransactionOperationTypeObjectValue(
			model.id_route_transaction_operation_type,
			model.transcation_operation_type_name,
		);
	}

	private taxInTransactionModelToDomainObject(model: TaxInTransactionModel): TaxInTransactionObjectValue {
		const createdAt = this.toDate(model.created_at, 'TaxInTransactionModel.created_at');

		return new TaxInTransactionObjectValue(
			model.id_tax_in_transaction,
			model.id_transaction,
			model.id_tax,
			model.tax_rate_at_moment_of_transaction,
			createdAt,
		);
	}

	private transactionDescriptionModelToDomainObject(
		model: TransactionDescriptionModel,
	): TransactionDescriptionObjectValue {
		const createdAt = this.toDate(model.created_at, 'TransactionDescriptionModel.created_at');

		if (!Object.values(ROUTE_TRANSACTION_OPERATION_TYPE).includes(model.id_transaction_operation_type as ROUTE_TRANSACTION_OPERATION_TYPE)) {
			throw new Error('Invalid id_transaction_operation_type in TransactionDescriptionModel');
		}

		return new TransactionDescriptionObjectValue(
			model.id_transaction_description,
			model.price_at_moment,
			model.cost_at_moment,
			model.amount,
			createdAt,
			model.id_transaction,
			model.id_transaction_operation_type as ROUTE_TRANSACTION_OPERATION_TYPE,
			model.id_product,
		);
	}

	private taxModelToDomainObject(model: TaxModel): TaxEntity {
		const createdAt = this.toDate(model.created_at, 'TaxModel.created_at');

		return new TaxEntity(
			model.id_tax,
			model.tax_name,
			model.tax_rate,
			createdAt,
		);
	}

	private transactionModelToDomainObject(
		model: TransactionModel,
		paymentMethodModel: PaymentMethodModel,
		paymentSchemaModel: PaymentSchemaModel,
		transactionDescriptionModels: TransactionDescriptionModel[],
	): TransactionEntity {
		const createdAt = this.toDate(model.created_at, 'TransactionModel.created_at');

		if (!Object.values(TRANSACTION_STATUS_ENUM).includes(model.state)) {
			throw new Error('Invalid state in TransactionModel');
		}

		if (typeof model.latitude !== 'string' || typeof model.longitude !== 'string') {
			throw new Error('TransactionModel latitude and longitude are required for domain conversion');
		}

		return new TransactionEntity(
			model.id_transaction,
			model.state,
			model.received_amount,
			model.id_invoice_concept,
			model.latitude,
			model.longitude,
			createdAt,
			model.id_client,
			model.id_work_day,
			this.paymentMethodModelToDomainObject(paymentMethodModel),
			this.paymentSchemaModelToDomainObject(paymentSchemaModel),
			transactionDescriptionModels.map((description) => this.transactionDescriptionModelToDomainObject(description)),
			model.cfdi,
			model.id_location,
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
