import { Inject, Injectable } from '@nestjs/common';

import { WorkDayRepository } from '@/src/business-operation-route/core/interfaces/work-day.repository';
import { WorkDayOperationHistoricEntity } from '@/src/business-operation-route/core/entities/work-day-operation-historic.entity';
import { WorkDayOperationHistoricDto } from '@/src/business-operation-route/application/dtos/work-day-operation-historic.dto';
import { Mapper } from '@/src/business-operation-route/application/mappers/entity-dto.mapper';

@Injectable()
export class RetrieveWorkDayOperationsHistoricByWorkDayIdQuery {
	constructor(
		@Inject(WorkDayRepository) private readonly workDayRepository: WorkDayRepository,
		private readonly mapper: Mapper,
	) {}

	async execute(work_day_id: string[]): Promise<WorkDayOperationHistoricDto[]> {
		const maxIds = 100;
		const workDayIdToRetrieve = work_day_id.slice(0, maxIds);

		const records: WorkDayOperationHistoricEntity[] =
			await this.workDayRepository.retrieveWorkDayOperationsHistoricByWorkDayId(
				workDayIdToRetrieve,
			);

		return records.map((record) => this.mapper.toDto(record));
	}
}
