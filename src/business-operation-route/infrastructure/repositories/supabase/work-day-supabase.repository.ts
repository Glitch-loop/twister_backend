import { Injectable } from '@nestjs/common';

import { WorkDayRepository } from '@/src/business-operation-route/core/interfaces/work-day.repository';
import { WorkDayEntity } from '@/src/business-operation-route/core/entities/work-day.entity';
import { WorkDayOperationHistoricEntity } from '@/src/business-operation-route/core/entities/work-day-operation-historic.entity';
import { NoteObjectValue } from '@/src/business-operation-route/core/value-objects/note.object-value';

import { WorkDayModel } from '@/src/business-operation-route/application/models/work-day.model';
import { WorkDayNoteModel } from '@/src/business-operation-route/application/models/work-day-note.model';
import { WorkDayOperationHistoricModel } from '@/src/business-operation-route/application/models/work-day-operation-historic.model';
import { Mapper } from '@/src/business-operation-route/application/mappers/entity-model.mapper';
import { DAY_OPERATIONS_ENUM } from '@/src/business-operation-route/core/enums/day-operations.enum';

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

	listWorkDays(
		limit: number,
		start_date?: Date,
		end_date?: Date,
		final_pretty_cash?: number,
		id_route_day?: string[],
		id_vendor?: string[],
		id_pay_stub?: string[],
		nextCreatedAt?: string,
		nextId?: string,
	): Promise<WorkDayEntity[]> {
		return this.executeListWorkDays(
			limit,
			start_date,
			end_date,
			final_pretty_cash,
			id_route_day,
			id_vendor,
			id_pay_stub,
			nextCreatedAt,
			nextId,
		);
	}

	listWorkDaysHistoric(
		limit: number,
		start_date?: Date,
		end_date?: Date,
		id_location?: number,
		id_route_transaction?: string[],
		id_route_day?: string[],
		operation_type?: DAY_OPERATIONS_ENUM[],
		id_work_day?: string[],
		nextCreatedAt?: string,
		nextId?: string,
	): Promise<WorkDayOperationHistoricEntity[]> {
		return this.executeListWorkDaysHistoric(
			limit,
			start_date,
			end_date,
			id_location,
			id_route_transaction,
			id_route_day,
			operation_type,
			id_work_day,
			nextCreatedAt,
			nextId,
		);
	}

	async retrieveWorkDayByWorkDayId(work_day_id: string[]): Promise<WorkDayEntity[]> {
		if (work_day_id.length === 0) {
			return [];
		}

		try {
			const { data, error } = await this.supabase
				.from('work_days')
				.select('*')
				.in('id_work_day', work_day_id);

			if (error) {
				throw new Error(`Failed to retrieve work days by id: ${error.message}`);
			}

			const workDayModels = (data ?? []) as WorkDayModel[];
			return this.composeWorkDays(workDayModels);
		} catch (error) {
			throw new Error(
				`Failed to retrieve work days by id: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	async retrieveWorkDayOperationsHistoricByWorkDayId(work_day_id: string[]): Promise<WorkDayOperationHistoricEntity[]> {
		if (work_day_id.length === 0) {
			return [];
		}

		try {
			const { data, error } = await this.supabase
				.from('work_day_operations_historic')
				.select('*')
				.in('id_work_day', work_day_id);

			if (error) {
				throw new Error(`Failed to retrieve work day operations historic by work day id: ${error.message}`);
			}

			return ((data ?? []) as WorkDayOperationHistoricModel[])
				.map((model) => this.mapper.toDomainObject(model));
		} catch (error) {
			throw new Error(
				`Failed to retrieve work day operations historic by work day id: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	private async executeListWorkDays(
		limit: number,
		start_date_start_work_day?: Date,
		end_date_end_work_day?: Date,
		final_pretty_cash?: number,
		id_route_day?: string[],
		id_vendor?: string[],
		id_pay_stub?: string[],
		nextCreatedAt?: string,
		nextId?: string,
	): Promise<WorkDayEntity[]> {
		try {
			let query = this.supabase
				.from('work_days')
				.select('*')
				.order('start_date', { ascending: false })
				.order('id_work_day', { ascending: false })
				.limit(limit);

			if (start_date_start_work_day) query = query.gte('start_date', start_date_start_work_day.toISOString());
			if (end_date_end_work_day) query = query.lte('start_date', end_date_end_work_day.toISOString());
			if (final_pretty_cash !== undefined) query = query.eq('final_petty_cash', final_pretty_cash);
			if (id_route_day && id_route_day.length > 0) query = query.in('id_route_day', id_route_day);
			if (id_vendor && id_vendor.length > 0) query = query.in('id_user', id_vendor);
			if (id_pay_stub && id_pay_stub.length > 0) query = query.in('id_payment_stub', id_pay_stub);

			if (nextCreatedAt && nextId) {
				query = query.or(
					`start_date.lt."${nextCreatedAt}",and(start_date.eq."${nextCreatedAt}",id_work_day.lt."${nextId}")`,
				);
			}

			const { data, error } = await query;

			if (error) {
				throw new Error(`Failed to list work days: ${error.message}`);
			}

			return this.composeWorkDays((data ?? []) as WorkDayModel[]);
		} catch (error) {
			throw new Error(
				`Failed to list work days: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	private async executeListWorkDaysHistoric(
		limit: number,
		start_date_created_at?: Date,
		end_date_created_at?: Date,
		id_location?: number,
		id_route_transaction?: string[],
		id_route_day?: string[],
		operation_type?: DAY_OPERATIONS_ENUM[],
		id_work_day?: string[],
		nextCreatedAt?: string,
		nextId?: string,
	): Promise<WorkDayOperationHistoricEntity[]> {
		try {
			let query = this.supabase
				.from('work_day_operations_historic')
				.select('*')
				.order('created_at', { ascending: false })
				.order('id_work_day_operation', { ascending: false })
				.limit(limit);

			if (start_date_created_at) query = query.gte('created_at', start_date_created_at.toISOString());
			if (end_date_created_at) query = query.lte('created_at', end_date_created_at.toISOString());
			if (id_location !== undefined) query = query.eq('id_client', id_location);
			if (id_route_transaction && id_route_transaction.length > 0) query = query.in('id_route_transaction', id_route_transaction);
			if (id_route_day && id_route_day.length > 0) query = query.in('id_route_day', id_route_day);
			if (operation_type && operation_type.length > 0) query = query.in('id_operation_type', operation_type);
			if (id_work_day && id_work_day.length > 0) query = query.in('id_work_day', id_work_day);

			if (nextCreatedAt && nextId) {
				query = query.or(
					`created_at.lt."${nextCreatedAt}",and(created_at.eq."${nextCreatedAt}",id_work_day_operation.lt."${nextId}")`,
				);
			}

			const { data, error } = await query;

			if (error) {
				throw new Error(`Failed to list work day operations historic: ${error.message}`);
			}

			return ((data ?? []) as WorkDayOperationHistoricModel[])
				.map((model) => this.mapper.toDomainObject(model));
		} catch (error) {
			throw new Error(
				`Failed to list work day operations historic: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	private async composeWorkDays(workDayModels: WorkDayModel[]): Promise<WorkDayEntity[]> {
		if (workDayModels.length === 0) {
			return [];
		}

		const ids = workDayModels.map((model) => model.id_work_day);
		const notes = await this.retrieveWorkDayNotes(ids);
		const notesByWorkDay = new Map<string, WorkDayNoteModel[]>();

		for (const note of notes) {
			const current = notesByWorkDay.get(note.id_work_day) ?? [];
			current.push(note);
			notesByWorkDay.set(note.id_work_day, current);
		}

		return workDayModels.map((model) =>
			this.mapper.toDomainObject(model, notesByWorkDay.get(model.id_work_day) ?? []),
		);
	}

	private async retrieveWorkDayNotes(workDayIds: string[]): Promise<WorkDayNoteModel[]> {
		if (workDayIds.length === 0) {
			return [];
		}

		const { data, error } = await this.supabase
			.from('work_day_notes')
			.select('*')
			.in('id_work_day', workDayIds);

		if (error) {
			throw new Error(`Failed to retrieve work day notes: ${error.message}`);
		}

		return (data ?? []) as WorkDayNoteModel[];
	}
}
