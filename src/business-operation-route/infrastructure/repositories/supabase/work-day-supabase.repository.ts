import { Injectable } from '@nestjs/common';

import { WorkDayRepository } from '@/src/business-operation-route/core/interfaces/work-day.repository';
import { WorkDayEntity } from '@/src/business-operation-route/core/entities/work-day.entity';
import { WorkDayOperationHistoricEntity } from '@/src/business-operation-route/core/entities/work-day-operation-historic.entity';
import { NoteObjectValue } from '@/src/business-operation-route/core/value-objects/note.object-value';

import { WorkDayModel } from '@/src/business-operation-route/application/models/work-day.model';
import { WorkDayNoteModel } from '@/src/business-operation-route/application/models/work-day-note.model';
import { WorkDayOperationHistoricModel } from '@/src/business-operation-route/application/models/work-day-operation-historic.model';
import { Mapper } from '@/src/business-operation-route/application/mappers/entity-model.mapper';

import { SupabaseDataSource } from '@/src/shared/infrastructure/datasources/supabase-data-source';

@Injectable()
export class WorkDaySupabaseRepository implements WorkDayRepository {
	constructor(
		private readonly supabaseDataSource: SupabaseDataSource,
		private readonly mapper: Mapper,
	) {}

	private get supabase() {
		return this.supabaseDataSource.getClient();
	}

	async insertWorkDay(work_day: WorkDayEntity): Promise<void> {
		try {
			const workDayModel: WorkDayModel = this.mapper.toModel(work_day);

			const { error } = await this.supabase
				.from('work_days')
				.insert(workDayModel);

			if (error) {
				throw new Error(`Failed to insert work day: ${error.message}`);
			}

			if (work_day.notes.length > 0) {
				const workDayNoteModels: WorkDayNoteModel[] = work_day.notes.map((note) =>
					this.mapper.toModel(note),
				);

				const { error: notesError } = await this.supabase
					.from('work_day_notes')
					.insert(workDayNoteModels);

				if (notesError) {
					throw new Error(`Failed to insert work day notes: ${notesError.message}`);
				}
			}
		} catch (error) {
			throw new Error(
				`Failed to insert work day: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	async updateWorkDayEntity(work_day: WorkDayEntity): Promise<void> {
		try {
			const workDayModel: WorkDayModel = this.mapper.toModel(work_day);

			const payload: Partial<WorkDayModel> = {
				start_date: workDayModel.start_date,
				finish_date: workDayModel.finish_date,
				id_route: workDayModel.id_route,
				start_petty_cash: workDayModel.start_petty_cash,
				final_petty_cash: workDayModel.final_petty_cash,
				id_route_day: workDayModel.id_route_day,
				id_user: workDayModel.id_user,
				id_payment_stub: workDayModel.id_payment_stub,
			};

			const { error } = await this.supabase
				.from('work_days')
				.update(payload)
				.eq('id_work_day', workDayModel.id_work_day);

			if (error) {
				throw new Error(`Failed to update work day: ${error.message}`);
			}
		} catch (error) {
			throw new Error(
				`Failed to update work day: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	async insertWorkDayNote(id_work_day: string, work_day: NoteObjectValue): Promise<void> {
		try {
			const workDayNoteModel: WorkDayNoteModel = {
				...this.mapper.toModel(work_day),
				id_work_day,
			};

			const { error } = await this.supabase
				.from('work_day_notes')
				.insert(workDayNoteModel);

			if (error) {
				throw new Error(`Failed to insert work day note: ${error.message}`);
			}
		} catch (error) {
			throw new Error(
				`Failed to insert work day note: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	async insertWorkDayHistoric(work_day_operations_hisotic: WorkDayOperationHistoricEntity[]): Promise<void> {
		try {
			if (work_day_operations_hisotic.length === 0) {
				return;
			}

			const historicModel: WorkDayOperationHistoricModel[] = work_day_operations_hisotic.map((historic) =>
				this.mapper.toModel(historic),
			);

			const { error } = await this.supabase
				.from('work_day_operations_historic')
				.insert(historicModel);

			if (error) {
				throw new Error(`Failed to insert work day operation historic: ${error.message}`);
			}
		} catch (error) {
			throw new Error(
				`Failed to insert work day operation historic: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}
}
