import { Inject, Injectable } from '@nestjs/common';

import { TransactionDto } from '@/src/sellings/application/dtos/transaction.dto';
import { EntityDtoMapper } from '@/src/sellings/application/mappers/entity-dto.mapper';
import { TransactionEntity } from '@/src/sellings/core/entities/transaction.entity';
import { RouteTransactionRepository } from '@/src/sellings/core/interfaces/route-transactions.repository';

@Injectable()
export class RetrieveTransactionsByIdTransactionQuery {
	constructor(
		@Inject(RouteTransactionRepository)
		private readonly routeTransactionRepository: RouteTransactionRepository,
		private readonly mapper: EntityDtoMapper,
	) {}

	async execute(idTransaction: string[]): Promise<TransactionDto[]> {
		const maxIds = 100;
		const idsToRetrieve = idTransaction.slice(0, maxIds);

		const transactions: TransactionEntity[] = await this.routeTransactionRepository.retrieveTransactionsByIdTransaction(
			idsToRetrieve,
		);

		return transactions.map((transaction) => this.mapper.toDto(transaction));
	}
}

