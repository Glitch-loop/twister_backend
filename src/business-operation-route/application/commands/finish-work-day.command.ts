import { Inject, Injectable } from '@nestjs/common';

import { WorkDayRepository } from '@/src/business-operation-route/core/interfaces/work-day.repository';
import { WorkDayEntity } from '@/src/business-operation-route/core/entities/work-day.entity';
import { WorkDayAggregate } from '@/src/business-operation-route/core/aggregates/work-day.aggregate';
import { BusinessRuleException } from '@/src/shared/errors/BusinessRuleException';

@Injectable()
export class UpdateWorkDayCommand {
	constructor(
		@Inject(WorkDayRepository) private readonly workDayRepository: WorkDayRepository,
	) {}

	async execute(
		id_work_day: string,
		finish_date?: Date,
		final_petty_cash?: number,
	): Promise<void> {
		const workDays: WorkDayEntity[] = await this.workDayRepository.retrieveWorkDayByWorkDayId([id_work_day]);

		if (workDays.length === 0) {
			throw new BusinessRuleException(
				`The work day with id ${id_work_day} you are trying to finish does not exist`,
			);
		}

		const workDayAggregate = new WorkDayAggregate(workDays[0]);

		workDayAggregate.finishWorkDay(
			final_petty_cash ?? workDays[0].start_petty_cash,
			finish_date ?? new Date(),
		);

		const workDay: WorkDayEntity = workDayAggregate.getWorkDayInformation();

		await this.workDayRepository.updateWorkDayEntity(workDay);
	}
}
