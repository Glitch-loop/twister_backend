// Libraries
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

// Constant
import { GENERAL_PUBLIC_CLIENT } from '@/src/sellings/core/constants/general_public_client.constant'
 
// Repositories
import { RouteTransactionRepository } from '@/src/sellings/core/interfaces/route-transactions.repository';

// Enum
import { ROUTE_TRANSACTION_OPERATION_TYPE } from '@/src/sellings/core/enums/route-transaction-operation-type.enum';

// Aggregate
import { TransactionAggregate } from '@/src/sellings/core/aggregates/transaction.aggregate';

// Mappers
import { EntityDtoMapper } from '@/src/sellings/application/mappers/entity-dto.mapper';

// Shared
import { DOMAIN_EVENT_ENUM } from '@/src/shared/core/enums/domain-event.enum';
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

interface RegisterTransactionDescriptionInput {
	id_transaction_description?: string;
	price_at_moment: number;
	cost_at_moment: number;
	quantity?: number;
	amount?: number;
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
		private readonly eventEmitter: EventEmitter2,
		private readonly mapper: EntityDtoMapper,
	) {}

	async execute(
		received_amount: number,
		id_work_day: string,
		id_payment_method: string,
		id_payment_schema: string,
		transaction_descriptions: RegisterTransactionDescriptionInput[],
		id_invoice_concept?: string,
		latitude?: string,
		longitude?: string,
		id_client?: string,
		id_transaction?: string,
		created_at?: Date,
		id_location?: string,
		cfdi?: string,
	): Promise<void> {
		const idTransactionToUse = id_transaction ?? this.integrityRepository.generateUUIDv4();
		const createdAtToUse = created_at ?? new Date();
		const paymentMethods = await this.routeTransactionRepository.listPaymentMethods();
		const paymentSchema = await this.routeTransactionRepository.listPaymentSchema();
		const transactionAggregate = new TransactionAggregate(undefined, paymentMethods, paymentSchema);
		const idClient:string = id_client ? id_client : GENERAL_PUBLIC_CLIENT.id_client

		transactionAggregate.createNewTransaction(
			idTransactionToUse,
			received_amount,
			createdAtToUse,
			idClient,
			id_work_day,
			id_payment_method,
			id_payment_schema,
			id_invoice_concept ? id_invoice_concept : null,
			latitude ? latitude : null,
			longitude ? longitude : null,
			cfdi ? cfdi : null,
			id_location ? id_location : null,
		);

		for (const description of transaction_descriptions) {
			if (!Object.values(ROUTE_TRANSACTION_OPERATION_TYPE).includes(description.id_transaction_operation_type as ROUTE_TRANSACTION_OPERATION_TYPE)) {
				throw new Error('Invalid transaction operation type provided.');
			}

			const quantityToUse = description.quantity ?? description.amount;
			if (quantityToUse === undefined) {
				throw new Error('Transaction description quantity is required.');
			}

			transactionAggregate.addRouteDescription(
				description.id_transaction_description ?? this.integrityRepository.generateUUIDv4(),
				description.price_at_moment,
				description.cost_at_moment,
				quantityToUse,
				description.created_at ?? createdAtToUse,
				idTransactionToUse,
				description.id_transaction_operation_type as ROUTE_TRANSACTION_OPERATION_TYPE,
				description.id_product,
			);
		}

		await this.routeTransactionRepository.createTransaction(transactionAggregate.getTransaction());

		this.eventEmitter.emit(
			DOMAIN_EVENT_ENUM.TRANSACTIONS_OPERATION_EVENT,
			this.mapper.toDto(transactionAggregate.getTransaction()),
		);
	}
}

