import { isWorkDayEntity } from '@/src/business-operation-route/application/guards/entities/work-day.guard';

describe('isWorkDayEntity', () => {
  it('returns true for a valid work day entity shape', () => {
    expect(isWorkDayEntity({
      id_work_day: 'wd-1',
      start_date: new Date('2024-01-01T08:00:00.000Z'),
      start_petty_cash: 100,
      id_route_day: 'rd-1',
      id_user: 'user-1',
      notes: [],
      finish_date: null,
      final_petty_cash: null,
      id_payment_stub: null,
    })).toBe(true);
  });

  it('returns false when start_petty_cash is not a number', () => {
    expect(isWorkDayEntity({
      id_work_day: 'wd-1',
      start_date: new Date('2024-01-01T08:00:00.000Z'),
      start_petty_cash: '100',
      id_route_day: 'rd-1',
      id_user: 'user-1',
      notes: [],
      finish_date: null,
      final_petty_cash: null,
      id_payment_stub: null,
    })).toBe(false);
  });
});
