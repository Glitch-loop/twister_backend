import { Injectable } from '@nestjs/common';

// Entities
import { WorkDayEntity } from '@/src/business-operation-route/core/entities/work-day.entity';
import { WorkDayOperationHistoricEntity } from '@/src/business-operation-route/core/entities/work-day-operation-historic.entity';

// Object values
import { NoteObjectValue } from '@/src/business-operation-route/core/value-objects/note.object-value';

// Models
import { WorkDayModel } from '@/src/business-operation-route/application/models/work-day.model';
import { WorkDayNoteModel } from '@/src/business-operation-route/application/models/work-day-note.model';
import { WorkDayOperationHistoricModel } from '@/src/business-operation-route/application/models/work-day-operation-historic.model';

// Guards
import { isWorkDayEntity } from '@/src/business-operation-route/application/guards/entities/work-day.guard';
import { isWorkDayOperationHistoricEntity } from '@/src/business-operation-route/application/guards/entities/work-day-operation-historic.guard';
import { isWorkDayModel } from '@/src/business-operation-route/application/guards/models/work-day.guard';
import { isWorkDayOperationHistoricModel } from '@/src/business-operation-route/application/guards/models/work-day-operation-historic.guard';
import { isWorkDayNoteModel } from '@/src/business-operation-route/application/guards/models/work-day-note.guard';
import { isNoteObjectValue } from '@/src/business-operation-route/application/guards/object-values/note.guard';

@Injectable()
export class Mapper {
	// ==================== OVERLOADED FUNCTIONS FOR MAPPING ====================
	// toModel overloads
	toModel(domainObject: WorkDayEntity): WorkDayModel;
	toModel(domainObject: NoteObjectValue): WorkDayNoteModel;
	toModel(domainObject: WorkDayOperationHistoricEntity): WorkDayOperationHistoricModel;
	toModel(
		domainObject: WorkDayEntity | NoteObjectValue | WorkDayOperationHistoricEntity,
	): WorkDayModel | WorkDayNoteModel | WorkDayOperationHistoricModel {

		if (isWorkDayEntity(domainObject)) {
			return this.workDayDomainObjectToModel(domainObject);
		}

		if (isNoteObjectValue(domainObject)) {
			return this.workDayNoteDomainObjectToModel(domainObject);
		}

		if (isWorkDayOperationHistoricEntity(domainObject)) {
			return this.workDayOperationHistoricDomainObjectToModel(domainObject);
		}

		throw new Error('Invalid input for mapping to model.');
	}

	// toDomainObject overloads
	toDomainObject(model: WorkDayOperationHistoricModel): WorkDayOperationHistoricEntity;
	toDomainObject(model: WorkDayNoteModel): NoteObjectValue;
	toDomainObject(model: WorkDayModel, workDayNoteModels: WorkDayNoteModel[]): WorkDayEntity;
	toDomainObject(
		model: WorkDayOperationHistoricModel | WorkDayNoteModel | WorkDayModel,
		workDayNoteModels?: WorkDayNoteModel[],
	): WorkDayOperationHistoricEntity | NoteObjectValue | WorkDayEntity {
		if (isWorkDayOperationHistoricModel(model)) {
			return this.workDayOperationHistoricModelToDomainObject(model);
		}

		if (isWorkDayNoteModel(model)) {
			return this.workDayNoteModelToDomainObject(model);
		}

		if (isWorkDayModel(model) && Array.isArray(workDayNoteModels) && workDayNoteModels.every(isWorkDayNoteModel)) {
			return this.workDayModelToDomainObject(model, workDayNoteModels);
		}

		throw new Error('Invalid input for mapping to domain object.');
	}

	// ==================== MAPPER METHODS DOMAIN OBJECT to MODEL ====================
	private workDayDomainObjectToModel(domainObject: WorkDayEntity): WorkDayModel {
		return {
			id_work_day: domainObject.id_work_day,
			start_date: domainObject.start_date,
			finish_date: domainObject.finish_date,
			id_route: domainObject.id_route,
			start_petty_cash: domainObject.start_petty_cash,
			final_petty_cash: domainObject.final_petty_cash,
			id_route_day: domainObject.id_route_day,
			id_user: domainObject.id_user,
			id_payment_stub: domainObject.id_payment_stub,
		};
	}

	private workDayNoteDomainObjectToModel(domainObject: NoteObjectValue): WorkDayNoteModel {
		return {
			id_work_day_notes: domainObject.id_note,
			note: domainObject.note,
			created_at: domainObject.created_at ?? new Date(),
			id_work_day: domainObject.id_owner,
		};
	}

	private workDayOperationHistoricDomainObjectToModel(domainObject: WorkDayOperationHistoricEntity): WorkDayOperationHistoricModel {
		return {
			id_work_day_operation: domainObject.id_work_day_operation,
			id_location: domainObject.id_location,
			id_inventory_operation: domainObject.id_inventory_operation,
			id_route_transaction: domainObject.id_route_transaction,
			id_route_day: domainObject.id_route_day,
			latitude: domainObject.latitude,
			longitude: domainObject.longitude,
			id_operation_type: domainObject.id_operation_type,
			created_at: domainObject.created_at,
			id_day_operation_dependent: domainObject.id_day_operation_dependent,
			id_work_day: domainObject.id_work_day,
		};
	}

	// ==================== MAPPER METHODS MODEL to DOMAIN OBJECT ====================
	private workDayOperationHistoricModelToDomainObject(model: WorkDayOperationHistoricModel): WorkDayOperationHistoricEntity {
		return new WorkDayOperationHistoricEntity(
			model.id_work_day_operation,
			model.id_operation_type,
			model.created_at instanceof Date ? model.created_at : new Date(model.created_at),
			model.id_work_day,
			model.latitude,
			model.longitude,
			model.id_location,
			model.id_route_transaction,
			model.id_inventory_operation,
			model.id_route_day,
			model.id_day_operation_dependent,
		);
	}

	private workDayNoteModelToDomainObject(model: WorkDayNoteModel): NoteObjectValue {
		return new NoteObjectValue(
			model.id_work_day_notes,
			model.note,
			model.id_work_day,
			model.created_at instanceof Date ? model.created_at : new Date(model.created_at),
		);
	}

	private workDayModelToDomainObject(model: WorkDayModel, workDayNoteModels: WorkDayNoteModel[]): WorkDayEntity {
    return new WorkDayEntity(
			model.id_work_day,
			model.start_date instanceof Date ? model.start_date : new Date(model.start_date),
			model.id_route,
			model.start_petty_cash,
			model.id_route_day,
			model.id_user,
			workDayNoteModels.map((noteModel) => this.workDayNoteModelToDomainObject(noteModel)),
			model.finish_date instanceof Date || model.finish_date === undefined
				? model.finish_date
				: new Date(model.finish_date),
			model.final_petty_cash,
			model.id_payment_stub,
		);
	}
}
