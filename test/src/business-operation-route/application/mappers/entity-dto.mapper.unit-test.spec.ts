import { Mapper } from '@/src/business-operation-route/application/mappers/entity-dto.mapper';
import { WorkDayDto } from '@/src/business-operation-route/application/dtos/work-day.dto';
import { WorkDayNoteDto } from '@/src/business-operation-route/application/dtos/work-day-note.dto';
import { WorkDayOperationHistoricDto } from '@/src/business-operation-route/application/dtos/work-day-operation-historic.dto';
import { WorkDayEntity } from '@/src/business-operation-route/core/entities/work-day.entity';
import { WorkDayOperationHistoricEntity } from '@/src/business-operation-route/core/entities/work-day-operation-historic.entity';
import { NoteObjectValue } from '@/src/business-operation-route/core/value-objects/note.object-value';
import { DAY_OPERATIONS_ENUM } from '@/src/business-operation-route/core/enums/day-operations.enum';

describe('BusinessOperationRoute Mapper (entity-dto)', () => {
  const mapper = new Mapper();

  it('maps note dto to domain object', () => {
    const dto = new WorkDayNoteDto('n-1', 'text', 'wd-1', new Date('2024-01-01T00:00:00.000Z'));

    const result = mapper.toDomainObject(dto);

    expect(result).toBeInstanceOf(NoteObjectValue);
    expect((result as NoteObjectValue).id_note).toBe('n-1');
  });

  it('maps operation dto to domain object', () => {
    const dto = new WorkDayOperationHistoricDto(
      'op-1',
      DAY_OPERATIONS_ENUM.sales,
      new Date('2024-01-01T00:00:00.000Z'),
      '19.4',
      '-99.1',
      'wd-1',
      null,
      'rt-1',
      null,
      'rd-1',
      null,
    );

    const result = mapper.toDomainObject(dto);

    expect(result).toBeInstanceOf(WorkDayOperationHistoricEntity);
    expect((result as WorkDayOperationHistoricEntity).id_route_transaction).toBe('rt-1');
  });

  it('maps work day dto to domain object with note conversion', () => {
    const dto = new WorkDayDto(
      'wd-1',
      new Date('2024-01-01T08:00:00.000Z'),
      'route-1',
      100,
      'rd-1',
      'u-1',
      [new WorkDayNoteDto('n-1', 'hello', 'wd-1')],
      undefined,
      undefined,
      undefined,
    );

    const result = mapper.toDomainObject(dto);

    expect(result).toBeInstanceOf(WorkDayEntity);
    expect((result as WorkDayEntity).notes[0]).toBeInstanceOf(NoteObjectValue);
  });

  it('maps domain object to dto for all overloads', () => {
    const note = new NoteObjectValue('n-1', 'text', 'wd-1', new Date('2024-01-01T00:00:00.000Z'));
    const op = new WorkDayOperationHistoricEntity(
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
    const wd = new WorkDayEntity(
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

    expect(mapper.toDto(note)).toBeInstanceOf(WorkDayNoteDto);
    expect(mapper.toDto(op)).toBeInstanceOf(WorkDayOperationHistoricDto);
    expect(mapper.toDto(wd)).toBeInstanceOf(WorkDayDto);
  });

  it('throws for invalid mapping input', () => {
    expect(() => mapper.toDomainObject({} as WorkDayDto)).toThrow('Invalid input for mapping to domain object.');
    expect(() => mapper.toDto({} as WorkDayEntity)).toThrow('Invalid input for mapping to dto.');
  });
});
