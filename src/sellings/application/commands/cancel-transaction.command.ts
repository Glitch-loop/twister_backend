import { Inject, Injectable } from '@nestjs/common';

import { RouteTransactionRepository } from '@/src/sellings/core/interfaces/route-transactions.repository';

@Injectable()
export class CancelTransactionCommand {
	constructor(
		@Inject(RouteTransactionRepository)
		private readonly routeTransactionRepository: RouteTransactionRepository,
	) {}

	async execute(idTransaction: string): Promise<void> {
		await this.routeTransactionRepository.cancelTransaction(idTransaction);
	}
}

