import { Inject, Injectable } from '@nestjs/common';

import { WorkDayRepository } from '@/src/business-operation-route/core/interfaces/work-day.repository';
import { BusinessOperationDay } from '@/src/business-operation-route/core/aggregates/BusinessOperationDayAggregate';
import { DAY_OPERATIONS_ENUM } from '@/src/business-operation-route/core/enums/day-operations.enum';
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

@Injectable()
export class RegisterWorkDayBusinessOperationsCommand {
	constructor(
		@Inject(WorkDayRepository) private readonly workDayRepository: WorkDayRepository,
		@Inject(IntegrityRepository) private readonly integrityRepository: IntegrityRepository,
	) {}

	async execute(
		id_work_day: string,
		operations: Array<{
			id_operation_type: DAY_OPERATIONS_ENUM;
			created_at?: Date;
			id_client?: string;
			id_route_transaction?: string;
			id_route_day?: string;
			id_day_operation_dependent?: string;
			id_work_day_operation?: string;
		}>,
	): Promise<void> {
		const currentOperations = await this.workDayRepository.retrieveWorkDayOperationsHistoricByWorkDayId([
			id_work_day,
		]);

		const businessOperationDay = new BusinessOperationDay(
			currentOperations.length > 0 ? currentOperations : null,
		);

		for (const operation of operations) {
			businessOperationDay.createBusinessOperation({
				id_work_day_operation: operation.id_work_day_operation ?? this.integrityRepository.generateUUIDv4(),
				id_work_day,
				id_operation_type: operation.id_operation_type,
				created_at: operation.created_at ?? new Date(),
				id_client: operation.id_client,
				id_route_transaction: operation.id_route_transaction,
				id_route_day: operation.id_route_day,
				id_day_operation_dependent: operation.id_day_operation_dependent,
			});
		}

		const newOperations = businessOperationDay.getNewDayOperations();

		if (!newOperations || newOperations.length === 0) {
			return;
		}

		await this.workDayRepository.insertWorkDayHistoric(newOperations);
	}
}
