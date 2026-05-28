import { Inject, Injectable } from '@nestjs/common';

import { WorkDayRepository } from '@/src/business-operation-route/core/interfaces/work-day.repository';
import { WorkDayOperationHistoricEntity } from '@/src/business-operation-route/core/entities/work-day-operation-historic.entity';
import { WorkDayOperationHistoricDto } from '@/src/business-operation-route/application/dtos/work-day-operation-historic.dto';
import { Mapper } from '@/src/business-operation-route/application/mappers/entity-dto.mapper';
import { DAY_OPERATIONS_ENUM } from '@/src/business-operation-route/core/enums/day-operations.enum';

@Injectable()
export class ListWorkDayOperationsHistoricQuery {
	constructor(
		@Inject(WorkDayRepository) private readonly workDayRepository: WorkDayRepository,
		private readonly mapper: Mapper,
	) {}

	async execute(
		limit?: number,
		start_date_created_at?: Date,
		end_date_created_at?: Date,
		id_location?: number,
		id_route_transaction?: string[],
		id_route_day?: string[],
		operation_type?: DAY_OPERATIONS_ENUM[],
		id_work_day?: string[],
		nextCreatedAt?: string,
		nextId?: string,
	): Promise<WorkDayOperationHistoricDto[]> {
		let limit_to_use = 1001;

		if ((nextCreatedAt && !nextId) || (!nextCreatedAt && nextId)) {
			throw new Error('If consulting a page larger than 1, pagination metadata is required.');
		}

		if (limit !== undefined && limit > 0 && limit <= 1000) {
			limit_to_use = limit + 1;
		}

		const records: WorkDayOperationHistoricEntity[] = await this.workDayRepository.listWorkDaysHistoric(
			limit_to_use,
			start_date_created_at,
			end_date_created_at,
			id_location,
			id_route_transaction,
			id_route_day,
			operation_type,
			id_work_day,
			nextCreatedAt,
			nextId,
		);

		return records.map((record) => this.mapper.toDto(record));
	}
}
