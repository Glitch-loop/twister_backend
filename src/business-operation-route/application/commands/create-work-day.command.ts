import { Inject, Injectable } from '@nestjs/common';

import { WorkDayRepository } from '@/src/business-operation-route/core/interfaces/work-day.repository';
import { WorkDayEntity } from '@/src/business-operation-route/core/entities/work-day.entity';
import { NoteObjectValue } from '@/src/business-operation-route/core/value-objects/note.object-value';
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

@Injectable()
export class CreateWorkDayCommand {
	constructor(
		@Inject(WorkDayRepository) private readonly workDayRepository: WorkDayRepository,
		@Inject(IntegrityRepository) private readonly integrityRepository: IntegrityRepository,
	) {}

	async execute(
		start_date: Date,
		id_route: string,
		start_petty_cash: number,
		id_route_day: string,
		id_user: string,
		notes: Array<{ id_note?: string; note: string; created_at?: Date }> = [],
		finish_date?: Date,
		final_petty_cash?: number,
		id_payment_stub?: string,
		id_work_day?: string,
	): Promise<void> {
		const workDayId = id_work_day ?? this.integrityRepository.generateUUIDv4();

		const workDayNotes: NoteObjectValue[] = notes.map((workDayNote) => new NoteObjectValue(
			workDayNote.id_note ?? this.integrityRepository.generateUUIDv4(),
			workDayNote.note,
			workDayId,
			workDayNote.created_at ?? new Date(),
		));

		const newWorkDay = new WorkDayEntity(
			workDayId,
			start_date,
			id_route,
			start_petty_cash,
			id_route_day,
			id_user,
			workDayNotes,
			finish_date,
			final_petty_cash,
			id_payment_stub,
		);

		await this.workDayRepository.insertWorkDay(newWorkDay);
	}
}
