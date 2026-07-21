import { Inject, Injectable } from '@nestjs/common';

import { TransactionDto } from '@/src/sellings/application/dtos/transaction.dto';
import { EntityDtoMapper } from '@/src/sellings/application/mappers/entity-dto.mapper';
import { TransactionEntity } from '@/src/sellings/core/entities/transaction.entity';
import { RouteTransactionRepository } from '@/src/sellings/core/interfaces/route-transactions.repository';

@Injectable()
export class ListTransactionsQuery {
	constructor(
		@Inject(RouteTransactionRepository)
		private readonly routeTransactionRepository: RouteTransactionRepository,
		private readonly mapper: EntityDtoMapper,
	) {}

	async execute(
		limit?: number,
		cfdi?: string,
		received_amount?: number,
		transaction_status?: number[],
		id_location?: string[],
		id_client?: string[],
		id_work_day?: string[],
		id_payment_method?: string[],
		id_payment_schema?: string[],
		lastIdTransaction?: string,
		lastCreatedAt?: string,
	): Promise<TransactionDto[]> {
		let limitToUse: number = 1001;

		if (lastCreatedAt && lastIdTransaction === undefined || lastCreatedAt === undefined && lastIdTransaction) {
			throw new Error('If consulting a page larger than 1, pagination metadata is required.');
		}

		if (limit) {
			if (limit <= 1000) {
				limitToUse = limit + 1;
			}
		}

		const transactions: TransactionEntity[] = await this.routeTransactionRepository.listTransactions(
			limitToUse,
			lastCreatedAt,
			lastIdTransaction,
			cfdi,
			received_amount,
			transaction_status,
			id_location,
			id_client,
			id_work_day,
			id_payment_method,
			id_payment_schema,
		);

		return transactions.map((transaction) => this.mapper.toDto(transaction));
	}
}

