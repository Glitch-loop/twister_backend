import { Inject, Injectable } from '@nestjs/common';

import { RouteTransactionRepository } from '@/src/sellings/core/interfaces/route-transactions.repository';
import { TRANSACTION_STATUS_ENUM } from '@/src/sellings/core/enums/route-status.enum';
import { ROUTE_TRANSACTION_OPERATION_TYPE } from '@/src/sellings/core/enums/route-transaction-operation-type.enum';
import { TransactionEntity } from '@/src/sellings/core/entities/transaction.entity';
import { PaymentMethodObjectValue } from '@/src/sellings/core/value-objects/payment-method.object-value';
import { PaymentSchemaObjectValue } from '@/src/sellings/core/value-objects/payment-schema.object-value';
import { TransactionDescriptionObjectValue } from '@/src/sellings/core/value-objects/transaction-description.object-value';
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

interface RegisterTransactionDescriptionInput {
	id_transaction_description?: string;
	price_at_moment: number;
	cost_at_moment: number;
	amount: number;
	created_at?: Date;
	id_transaction_operation_type: string;
	id_product: string;
}

@Injectable()
export class RegisterTransactionCommand {
	constructor(
		@Inject(RouteTransactionRepository)
		private readonly routeTransactionRepository: RouteTransactionRepository,
		@Inject(IntegrityRepository)
		private readonly integrityRepository: IntegrityRepository,
	) {}

	async execute(
		state: number,
		received_amount: number,
		id_invoice_concept: string,
		id_client: string,
		id_work_day: string,
		id_payment_method: string,
		id_payment_schema: string,
		transaction_descriptions: RegisterTransactionDescriptionInput[],
		id_transaction?: string,
		created_at?: Date,
		latitude?: string,
		longitude?: string,
		id_location?: string,
		cfdi?: string,
	): Promise<void> {
		if (!Object.values(TRANSACTION_STATUS_ENUM).includes(state)) {
			throw new Error('Invalid transaction status provided.');
		}

		const idTransactionToUse = id_transaction ?? this.integrityRepository.generateUUIDv4();
		const createdAtToUse = created_at ?? new Date();

		const paymentMethod = new PaymentMethodObjectValue(
			id_payment_method,
			'',
		);

		const paymentSchema = new PaymentSchemaObjectValue(
			id_payment_schema,
			'',
		);

		const transactionDescriptions = transaction_descriptions.map((description) => {
			if (!Object.values(ROUTE_TRANSACTION_OPERATION_TYPE).includes(description.id_transaction_operation_type as ROUTE_TRANSACTION_OPERATION_TYPE)) {
				throw new Error('Invalid transaction operation type provided.');
			}

			return new TransactionDescriptionObjectValue(
				description.id_transaction_description ?? this.integrityRepository.generateUUIDv4(),
				description.price_at_moment,
				description.cost_at_moment,
				description.amount,
				description.created_at ?? createdAtToUse,
				idTransactionToUse,
				description.id_transaction_operation_type as ROUTE_TRANSACTION_OPERATION_TYPE,
				description.id_product,
			);
		});

		const transactionEntity = new TransactionEntity(
			idTransactionToUse,
			state,
			received_amount,
			id_invoice_concept,
			latitude ?? '',
			longitude ?? '',
			createdAtToUse,
			id_client,
			id_work_day,
			paymentMethod,
			paymentSchema,
			transactionDescriptions,
			cfdi,
			id_location,
		);

		await this.routeTransactionRepository.createTransaction(transactionEntity);
	}
}

