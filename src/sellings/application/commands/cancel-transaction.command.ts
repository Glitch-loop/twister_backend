// Libraries
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

// Repositories
import { RouteTransactionRepository } from '@/src/sellings/core/interfaces/route-transactions.repository';

// Aggregates
import { TransactionAggregate } from '@/src/sellings/core/aggregates/transaction.aggregate';

// Mappers
import { EntityDtoMapper } from '@/src/sellings/application/mappers/entity-dto.mapper';

// Shared
import { DOMAIN_EVENT_ENUM } from '@/src/shared/core/enums/domain-event.enum';

@Injectable()
export class CancelTransactionCommand {
	constructor(
		@Inject(RouteTransactionRepository)
		private readonly routeTransactionRepository: RouteTransactionRepository,
		private readonly eventEmitter: EventEmitter2,
		private readonly mapper: EntityDtoMapper,
	) {}

	async execute(idTransaction: string): Promise<void> {
		const transactions = await this.routeTransactionRepository.retrieveTransactionsByIdTransaction([idTransaction]);

		if (transactions.length === 0) {
			throw new Error(`Transaction with id ${idTransaction} was not found.`);
		}

		const transactionAggregate = new TransactionAggregate(transactions[0]);
		transactionAggregate.cancelTransaction();

		await this.routeTransactionRepository.updateTransaction(transactionAggregate.getTransaction());

		this.eventEmitter.emit(
			DOMAIN_EVENT_ENUM.CANCEL_TRANSACTION_OPERATION_EVENT,
			this.mapper.toDto(transactionAggregate.getTransaction()),
		);
	}
}

