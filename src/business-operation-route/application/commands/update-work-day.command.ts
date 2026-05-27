import { Inject, Injectable } from '@nestjs/common';

import { WorkDayRepository } from '@/src/business-operation-route/core/interfaces/work-day.repository';
import { WorkDayEntity } from '@/src/business-operation-route/core/entities/work-day.entity';
import { NoteObjectValue } from '@/src/business-operation-route/core/value-objects/note.object-value';

@Injectable()
export class UpdateWorkDayCommand {
	constructor(
		@Inject(WorkDayRepository) private readonly workDayRepository: WorkDayRepository,
	) {}

	async execute(
		id_work_day: string,
		start_date: Date,
		id_route: string,
		start_petty_cash: number,
		id_route_day: string,
		id_user: string,
		notes: NoteObjectValue[] = [],
		finish_date?: Date,
		final_petty_cash?: number,
		id_payment_stub?: string,
	): Promise<void> {
		const workDay = new WorkDayEntity(
			id_work_day,
			start_date,
			id_route,
			start_petty_cash,
			id_route_day,
			id_user,
			notes,
			finish_date,
			final_petty_cash,
			id_payment_stub,
		);

		await this.workDayRepository.updateWorkDayEntity(workDay);
	}
}
