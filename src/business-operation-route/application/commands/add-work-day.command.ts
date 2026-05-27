import { Inject, Injectable } from '@nestjs/common';

import { WorkDayRepository } from '@/src/business-operation-route/core/interfaces/work-day.repository';
import { WorkDayOperationHistoricEntity } from '@/src/business-operation-route/core/entities/work-day-operation-historic.entity';
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

@Injectable()
export class AddWorkDayCommand {
	constructor(
		@Inject(WorkDayRepository) private readonly workDayRepository: WorkDayRepository,
		@Inject(IntegrityRepository) private readonly integrityRepository: IntegrityRepository,
	) {}

	async execute(
		id_work_day: string,
		operations: Array<{
			id_operation_type: string;
			created_at?: Date;
			id_client?: string;
			id_route_transaction?: string;
			id_route?: string;
			id_day_operation_dependent?: string;
			id_work_day_operation?: string;
		}>,
	): Promise<void> {
		const operationsHistoric: WorkDayOperationHistoricEntity[] = operations.map((operation) =>
			new WorkDayOperationHistoricEntity(
				operation.id_work_day_operation ?? this.integrityRepository.generateUUIDv4(),
				operation.id_operation_type,
				operation.created_at ?? new Date(),
				id_work_day,
				operation.id_client,
				operation.id_route_transaction,
				operation.id_route,
				operation.id_day_operation_dependent,
			),
		);

		await this.workDayRepository.insertWorkDayHistoric(operationsHistoric);
	}
}
