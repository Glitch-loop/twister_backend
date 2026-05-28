import { Inject, Injectable } from '@nestjs/common';

import { WorkDayRepository } from '@/src/business-operation-route/core/interfaces/work-day.repository';
import { WorkDayEntity } from '@/src/business-operation-route/core/entities/work-day.entity';
import { WorkDayDto } from '@/src/business-operation-route/application/dtos/work-day.dto';
import { Mapper } from '@/src/business-operation-route/application/mappers/entity-dto.mapper';

@Injectable()
export class RetrieveWorkDayByWorkDayIdQuery {
	constructor(
		@Inject(WorkDayRepository) private readonly workDayRepository: WorkDayRepository,
		private readonly mapper: Mapper,
	) {}

	async execute(work_day_id: string[]): Promise<WorkDayDto[]> {
		const maxIds = 100;
		const workDayIdToRetrieve = work_day_id.slice(0, maxIds);

		const workDays: WorkDayEntity[] = await this.workDayRepository.retrieveWorkDayByWorkDayId(
			workDayIdToRetrieve,
		);

		return workDays.map((workDay) => this.mapper.toDto(workDay));
	}
}
