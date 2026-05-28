import { Inject, Injectable } from '@nestjs/common';

import { WorkDayRepository } from '@/src/business-operation-route/core/interfaces/work-day.repository';
import { NoteObjectValue } from '@/src/business-operation-route/core/value-objects/note.object-value';
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

@Injectable()
export class CreateWorkDayNoteCommand {
	constructor(
		@Inject(WorkDayRepository) private readonly workDayRepository: WorkDayRepository,
		@Inject(IntegrityRepository) private readonly integrityRepository: IntegrityRepository,
	) {}

	async execute(
		id_work_day: string,
		note: string,
		created_at?: Date,
	): Promise<void> {
		const workDayNote = new NoteObjectValue(
			this.integrityRepository.generateUUIDv4(),
			note,
			id_work_day,
			created_at ?? new Date(),
		);

		await this.workDayRepository.insertWorkDayNote(id_work_day, workDayNote);
	}
}
