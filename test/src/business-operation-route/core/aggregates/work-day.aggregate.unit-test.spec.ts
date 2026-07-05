import { WorkDayAggregate } from '@/src/business-operation-route/core/aggregates/work-day.aggregate';
import { WorkDayEntity } from '@/src/business-operation-route/core/entities/work-day.entity';

describe('WorkDayAggregate', () => {
  const baseDate = new Date('2024-01-01T08:00:00.000Z');

  it('starts a work day with provided initial date', () => {
    const aggregate = new WorkDayAggregate(null);

    aggregate.startWorkDay('wd-1', 100, 'route-1', 'u-1', 'rd-1', baseDate);

    const info = aggregate.getWorkDayInformation();
    expect(info).toBeInstanceOf(WorkDayEntity);
    expect(info.start_date).toBe(baseDate);
    expect(info.start_petty_cash).toBe(100);
  });

  it('throws when starting with negative petty cash', () => {
    const aggregate = new WorkDayAggregate(null);

    expect(() => aggregate.startWorkDay('wd-1', -1, 'route-1', 'u-1', 'rd-1', baseDate)).toThrow(
      'Petty cash cannot be negative.',
    );
  });

  it('finishes a work day with valid values', () => {
    const aggregate = new WorkDayAggregate(null);
    aggregate.startWorkDay('wd-1', 100, 'route-1', 'u-1', 'rd-1', baseDate);

    const finishDate = new Date('2024-01-01T18:00:00.000Z');
    aggregate.finishWorkDay(120, finishDate);

    const info = aggregate.getWorkDayInformation();
    expect(info.final_petty_cash).toBe(120);
    expect(info.finish_date).toBe(finishDate);
  });

  it('throws when finishing before start date', () => {
    const aggregate = new WorkDayAggregate(null);
    aggregate.startWorkDay('wd-1', 100, 'route-1', 'u-1', 'rd-1', baseDate);

    expect(() => aggregate.finishWorkDay(120, new Date('2024-01-01T07:00:00.000Z'))).toThrow(
      'Finish date must be after start date.',
    );
  });

  it('throws when requesting info without state', () => {
    const aggregate = new WorkDayAggregate(null);

    expect(() => aggregate.getWorkDayInformation()).toThrow('Work day information is not set.');
  });

  it('returns true from isWorkDayFinished based on current implementation', () => {
    const aggregate = new WorkDayAggregate(null);
    aggregate.startWorkDay('wd-1', 100, 'route-1', 'u-1', 'rd-1', baseDate);

    expect(aggregate.isWorkDayFinished()).toBe(true);
  });
});
