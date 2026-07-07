import { isWorkDayModel } from '@/src/business-operation-route/application/guards/models/work-day.guard';

describe('isWorkDayModel', () => {
  it('returns true for a valid work day model', () => {
    expect(isWorkDayModel({
      id_work_day: 'wd-1',
      start_date: '2024-01-01T08:00:00.000Z',
      start_petty_cash: 100,
      finish_date: null,
      final_petty_cash: null,
      id_route_day: 'rd-1',
      id_user: 'u-1',
      id_payment_stub: null,
    })).toBe(true);
  });

  it('returns false when id_payment_stub is wrong type', () => {
    expect(isWorkDayModel({
      id_work_day: 'wd-1',
      start_date: '2024-01-01T08:00:00.000Z',
      start_petty_cash: 100,
      finish_date: null,
      final_petty_cash: null,
      id_route_day: 'rd-1',
      id_user: 'u-1',
      id_payment_stub: 10,
    })).toBe(false);
  });
});
