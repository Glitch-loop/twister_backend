import { Mapper } from '@/src/business-operation-route/application/mappers/entity-model.mapper';
import { WorkDayEntity } from '@/src/business-operation-route/core/entities/work-day.entity';
import { WorkDayOperationHistoricEntity } from '@/src/business-operation-route/core/entities/work-day-operation-historic.entity';
import { NoteObjectValue } from '@/src/business-operation-route/core/value-objects/note.object-value';
import { DAY_OPERATIONS_ENUM } from '@/src/business-operation-route/core/enums/day-operations.enum';
import type { WorkDayModel } from '@/src/business-operation-route/application/models/work-day.model';
import type { WorkDayNoteModel } from '@/src/business-operation-route/application/models/work-day-note.model';
import type { WorkDayOperationHistoricModel } from '@/src/business-operation-route/application/models/work-day-operation-historic.model';

describe('BusinessOperationRoute Mapper (entity-model)', () => {
  const mapper = new Mapper();
  const note = new NoteObjectValue('n-1', 'text', 'wd-1', new Date('2024-01-01T00:00:00.000Z'));
  const operationEntity = new WorkDayOperationHistoricEntity(
    'op-1',
    DAY_OPERATIONS_ENUM.sales,
    new Date('2024-01-01T00:00:00.000Z'),
    'wd-1',
    '19.4',
    '-99.1',
    null,
    'rt-1',
    null,
    'rd-1',
    null,
  );
  const workDayEntity = new WorkDayEntity(
    'wd-1',
    new Date('2024-01-01T08:00:00.000Z'),
    'route-1',
    100,
    'rd-1',
    'u-1',
    [note],
    undefined,
    undefined,
    undefined,
  );

  const noteModel: WorkDayNoteModel = {
    id_work_day_notes: 'n-1',
    note: 'text',
    created_at: '2024-01-01T00:00:00.000Z',
    id_work_day: 'wd-1',
  };

  const operationModel: WorkDayOperationHistoricModel = {
    id_work_day_operation: 'op-1',
    id_work_day: 'wd-1',
    id_operation_type: DAY_OPERATIONS_ENUM.sales,
    created_at: '2024-01-01T00:00:00.000Z',
    id_location: null,
    id_route_transaction: 'rt-1',
    id_inventory_operation: null,
    id_route_day: 'rd-1',
    latitude: '19.4',
    longitude: '-99.1',
    id_day_operation_dependent: null,
  };

  const workDayModel: WorkDayModel = {
    id_work_day: 'wd-1',
    start_date: '2024-01-01T08:00:00.000Z',
    finish_date: undefined,
    id_route: 'route-1',
    start_petty_cash: 100,
    final_petty_cash: undefined,
    id_route_day: 'rd-1',
    id_user: 'u-1',
    id_payment_stub: undefined,
  };

  it('converts workday note object value to workday note model', () => {
    expect(mapper.toModel(note)).toEqual(noteModel);
  });

  it('converts workday operation historic entity to workday operation historic model', () => {
    const model = mapper.toModel(operationEntity);

    expect(model).toEqual(operationModel);
  });

  it('converts workday entity to workday model', () => {
    const model = mapper.toModel(workDayEntity);

    expect(model).toEqual(workDayModel);
  });

  it('converts workday note model to workday note object value', () => {
    const domainObject = mapper.toDomainObject(noteModel);

    expect(domainObject).toBeInstanceOf(NoteObjectValue);
    expect(domainObject.id_note).toBe('n-1');
    expect(domainObject.note).toBe('text');
    expect(domainObject.id_owner).toBe('wd-1');
    expect(domainObject.created_at).toEqual(new Date('2024-01-01T00:00:00.000Z'));
  });

  it('converts workday operation historic model to workday operation historic entity', () => {
    const domainObject = mapper.toDomainObject(operationModel);

    expect(domainObject).toBeInstanceOf(WorkDayOperationHistoricEntity);
    expect(domainObject.id_work_day_operation).toBe('op-1');
    expect(domainObject.id_operation_type).toBe(DAY_OPERATIONS_ENUM.sales);
    expect(domainObject.id_work_day).toBe('wd-1');
  });

  it('converts workday model with nested note models to workday entity', () => {
    const domainObject = mapper.toDomainObject(workDayModel, [noteModel]);

    expect(domainObject).toBeInstanceOf(WorkDayEntity);
    expect(domainObject.id_work_day).toBe('wd-1');
    expect(domainObject.notes).toHaveLength(1);
    expect(domainObject.notes[0]).toBeInstanceOf(NoteObjectValue);
  });

  it('converts created_at string when mapping workday operation historic model', () => {
    const opModel = {
      id_work_day_operation: 'op-1',
      id_work_day: 'wd-1',
      id_operation_type: DAY_OPERATIONS_ENUM.sales,
      created_at: '2024-01-01T00:00:00.000Z',
      id_location: null,
      id_route_transaction: null,
      id_inventory_operation: null,
      id_route_day: 'rd-1',
      latitude: null,
      longitude: null,
      id_day_operation_dependent: null,
    } as unknown as WorkDayOperationHistoricModel;

    const opEntity = mapper.toDomainObject(opModel);

    expect(opEntity.created_at).toBeInstanceOf(Date);
  });

  it('converts created_at string when mapping workday note model', () => {
    const noteModel = {
      id_work_day_notes: 'n-1',
      note: 'text',
      created_at: '2024-01-01T00:00:00.000Z',
      id_work_day: 'wd-1',
    };

    const noteEntity = mapper.toDomainObject(noteModel);

    expect(noteEntity.created_at).toBeInstanceOf(Date);
  });

  it('converts start_date and finish_date strings when mapping workday model', () => {
    const workDayModel = {
      id_work_day: 'wd-1',
      start_date: '2024-01-01T08:00:00.000Z',
      finish_date: '2024-01-01T18:00:00.000Z',
      id_route: 'route-1',
      start_petty_cash: 100,
      final_petty_cash: 110,
      id_route_day: 'rd-1',
      id_user: 'u-1',
      id_payment_stub: null,
    } as unknown as WorkDayModel;

    const wdEntity = mapper.toDomainObject(workDayModel, [noteModel]);

    expect(wdEntity.start_date).toBeInstanceOf(Date);
    expect(wdEntity.finish_date).toBeInstanceOf(Date);
  });

  it('throws for invalid input when mapping to model', () => {
    expect(() => mapper.toModel({} as WorkDayEntity)).toThrow('Invalid input for mapping to model.');
  });

  it('throws for invalid input when mapping from model to domain object', () => {
    expect(() => mapper.toDomainObject({} as unknown as WorkDayOperationHistoricModel)).toThrow('Invalid input for mapping from model to domain object.');
  });
});
