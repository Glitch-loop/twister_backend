// Libraries
import { Inject, Injectable } from '@nestjs/common';

// Repositories
import { RouteTransactionRepository } from '@/src/sellings/core/interfaces/route-transactions.repository';

// Aggregates
import { TransactionAggregate } from '@/src/sellings/core/aggregates/transaction.aggregate';

@Injectable()
export class CancelTransactionCommand {
	constructor(
		@Inject(RouteTransactionRepository)
		private readonly routeTransactionRepository: RouteTransactionRepository,
	) {}

	async execute(idTransaction: string): Promise<void> {
		const transactions = await this.routeTransactionRepository.retrieveTransactionsByIdTransaction([idTransaction]);

		if (transactions.length === 0) {
			throw new Error(`Transaction with id ${idTransaction} was not found.`);
		}

		const transactionAggregate = new TransactionAggregate(transactions[0]);
		transactionAggregate.cancelTransaction();

		await this.routeTransactionRepository.updateTransaction(transactionAggregate.getTransaction());
	}
}

