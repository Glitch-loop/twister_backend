import { Injectable } from '@nestjs/common';

// DTOs
import { WorkDayDto } from '@/src/business-operation-route/application/dtos/work-day.dto';
import { WorkDayNoteDto } from '@/src/business-operation-route/application/dtos/work-day-note.dto';
import { WorkDayOperationHistoricDto } from '@/src/business-operation-route/application/dtos/work-day-operation-historic.dto';

// Entities
import { WorkDayEntity } from '@/src/business-operation-route/core/entities/work-day.entity';
import { WorkDayOperationHistoricEntity } from '@/src/business-operation-route/core/entities/work-day-operation-historic.entity';

// Object values
import { NoteObjectValue } from '@/src/business-operation-route/core/value-objects/note.object-value';

// Guards
import { isWorkDayDto } from '@/src/business-operation-route/application/guards/dtos/work-day.guard';
import { isWorkDayNoteDto } from '@/src/business-operation-route/application/guards/dtos/work-day-note.guard';
import { isWorkDayOperationHistoricDto } from '@/src/business-operation-route/application/guards/dtos/work-day-operation-historic.guard';
import { isWorkDayEntity } from '@/src/business-operation-route/application/guards/entities/work-day.guard';
import { isWorkDayOperationHistoricEntity } from '@/src/business-operation-route/application/guards/entities/work-day-operation-historic.guard';
import { isNoteObjectValue } from '@/src/business-operation-route/application/guards/object-values/note.guard';

@Injectable()
export class Mapper {
	// ==================== OVERLOADED FUNCTIONS FOR MAPPING ====================
	// toDomainObject overloads
	toDomainObject(dto: WorkDayNoteDto): NoteObjectValue;
	toDomainObject(dto: WorkDayOperationHistoricDto): WorkDayOperationHistoricEntity;
	toDomainObject(dto: WorkDayDto): WorkDayEntity;
	toDomainObject(
		dto: WorkDayNoteDto | WorkDayOperationHistoricDto | WorkDayDto,
	): NoteObjectValue | WorkDayOperationHistoricEntity | WorkDayEntity {
		if (isWorkDayNoteDto(dto)) {
			return this.workDayNoteDtoToDomainObject(dto);
		}

		if (isWorkDayOperationHistoricDto(dto)) {
			return this.workDayOperationHistoricDtoToDomainObject(dto);
		}

		if (isWorkDayDto(dto)) {
			return this.workDayDtoToDomainObject(dto);
		}

		throw new Error('Invalid input for mapping to domain object.');
	}

	// toDto overloads
	toDto(domainObject: NoteObjectValue): WorkDayNoteDto;
	toDto(domainObject: WorkDayOperationHistoricEntity): WorkDayOperationHistoricDto;
	toDto(domainObject: WorkDayEntity): WorkDayDto;
	toDto(
		domainObject: NoteObjectValue | WorkDayOperationHistoricEntity | WorkDayEntity,
	): WorkDayNoteDto | WorkDayOperationHistoricDto | WorkDayDto {
		if (isNoteObjectValue(domainObject)) {
			return this.workDayNoteDomainObjectToDto(domainObject);
		}

		if (isWorkDayOperationHistoricEntity(domainObject)) {
			return this.workDayOperationHistoricDomainObjectToDto(domainObject);
		}

		if (isWorkDayEntity(domainObject)) {
			return this.workDayDomainObjectToDto(domainObject);
		}

		throw new Error('Invalid input for mapping to dto.');
	}

	// ==================== MAPPER METHODS DOMAIN OBJECT to DTO ====================
	private workDayNoteDomainObjectToDto(domainObject: NoteObjectValue): WorkDayNoteDto {
		return new WorkDayNoteDto(
			domainObject.id_note,
			domainObject.note,
			domainObject.id_owner,
			domainObject.created_at.toISOString(),
		);
	}

	private workDayOperationHistoricDomainObjectToDto(domainObject: WorkDayOperationHistoricEntity): WorkDayOperationHistoricDto {
		return new WorkDayOperationHistoricDto(
			domainObject.id_work_day_operation,
			domainObject.id_operation_type,
			domainObject.created_at.toISOString(),
			domainObject.latitude,
			domainObject.longitude,
			domainObject.id_work_day,
			domainObject.id_location,
			domainObject.id_route_transaction,
			domainObject.id_inventory_operation,
			domainObject.id_route_day,
			domainObject.id_day_operation_dependent,
		);
	}

	private workDayDomainObjectToDto(domainObject: WorkDayEntity): WorkDayDto {
		return new WorkDayDto(
			domainObject.id_work_day,
			domainObject.start_date.toISOString(),
			domainObject.start_petty_cash,
			domainObject.id_route_day,
			domainObject.id_user,
			domainObject.notes.map((note) => this.workDayNoteDomainObjectToDto(note)),
			domainObject.finish_date === null ? null : domainObject.finish_date.toISOString(),
			domainObject.final_petty_cash,
			domainObject.id_payment_stub,
		);
	}

	// ==================== MAPPER METHODS DTO to DOMAIN OBJECT ====================
	private workDayNoteDtoToDomainObject(dto: WorkDayNoteDto): NoteObjectValue {
		return new NoteObjectValue(
			dto.id_note,
			dto.note,
			dto.id_owner,
			new Date(dto.created_at),
		);
	}

	private workDayOperationHistoricDtoToDomainObject(dto: WorkDayOperationHistoricDto): WorkDayOperationHistoricEntity {
		return new WorkDayOperationHistoricEntity(
			dto.id_work_day_operation,
			dto.id_operation_type,
			new Date(dto.created_at),
			dto.id_work_day,
			dto.latitude,
			dto.longitude,
			dto.id_location,
			dto.id_route_transaction,
			dto.id_inventory_operation,
			dto.id_route_day,
			dto.id_day_operation_dependent,
		);
	}

	private workDayDtoToDomainObject(dto: WorkDayDto): WorkDayEntity {
		return new WorkDayEntity(
			dto.id_work_day,
			new Date(dto.start_date),
			dto.start_petty_cash,
			dto.id_route_day,
			dto.id_user,
			dto.notes.map((note) => this.workDayNoteDtoToDomainObject(note)),
			dto.finish_date === null ? null : new Date(dto.finish_date),
			dto.final_petty_cash,
			dto.id_payment_stub,
		);
	}
}
