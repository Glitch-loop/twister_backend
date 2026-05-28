import { Inject, Injectable } from '@nestjs/common';

import { WorkDayRepository } from '@/src/business-operation-route/core/interfaces/work-day.repository';
import { WorkDayEntity } from '@/src/business-operation-route/core/entities/work-day.entity';
import { WorkDayDto } from '@/src/business-operation-route/application/dtos/work-day.dto';
import { Mapper } from '@/src/business-operation-route/application/mappers/entity-dto.mapper';

@Injectable()
export class ListWorkDayQuery {
	constructor(
		@Inject(WorkDayRepository) private readonly workDayRepository: WorkDayRepository,
		private readonly mapper: Mapper,
	) {}

	async execute(
		limit?: number,
		start_date_start_work_day?: Date,
		end_date_end_work_day?: Date,
		final_pretty_cash?: number,
		id_route_day?: string[],
		id_vendor?: string[],
		id_pay_stub?: string[],
		nextCreatedAt?: string,
		nextId?: string,
	): Promise<WorkDayDto[]> {
		let limit_to_use = 1001;

		if ((nextCreatedAt && !nextId) || (!nextCreatedAt && nextId)) {
			throw new Error('If consulting a page larger than 1, pagination metadata is required.');
		}

		if (limit !== undefined && limit > 0 && limit <= 1000) {
			limit_to_use = limit + 1;
		}

    console.log(id_vendor)
		const workDays: WorkDayEntity[] = await this.workDayRepository.listWorkDays(
			limit_to_use,
			start_date_start_work_day,
			end_date_end_work_day,
			final_pretty_cash,
			id_route_day,
			id_vendor,
			id_pay_stub,
			nextCreatedAt,
			nextId,
		);

		return workDays.map((workDay) => this.mapper.toDto(workDay));
	}
}
