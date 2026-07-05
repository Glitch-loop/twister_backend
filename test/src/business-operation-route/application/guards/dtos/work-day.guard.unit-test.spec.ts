import { isWorkDayDto } from '@/src/business-operation-route/application/guards/dtos/work-day.guard';

describe('isWorkDayDto', () => {
  it('returns true for a valid work day dto', () => {
    expect(isWorkDayDto({
      id_work_day: 'wd-1',
      id_route: 'route-1',
      start_petty_cash: 100,
      id_route_day: 'rd-1',
      id_user: 'user-1',
      notes: [{ id_note: 'n-1', note: 'note', id_owner: 'wd-1' }],
      final_petty_cash: null,
      id_payment_stub: null,
    })).toBe(true);
  });

  it('returns false when one note is invalid', () => {
    expect(isWorkDayDto({
      id_work_day: 'wd-1',
      id_route: 'route-1',
      start_petty_cash: 100,
      id_route_day: 'rd-1',
      id_user: 'user-1',
      notes: [{ id_note: 'n-1', id_owner: 'wd-1' }],
      final_petty_cash: null,
      id_payment_stub: null,
    })).toBe(false);
  });
});
