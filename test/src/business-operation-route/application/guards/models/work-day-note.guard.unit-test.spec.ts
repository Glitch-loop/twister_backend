import { isWorkDayNoteModel } from '@/src/business-operation-route/application/guards/models/work-day-note.guard';

describe('isWorkDayNoteModel', () => {
  it('returns true for a valid work day note model', () => {
    expect(isWorkDayNoteModel({
      id_work_day_notes: 'n-1',
      note: 'hello',
      id_work_day: 'wd-1',
    })).toBe(true);
  });

  it('returns false when id_work_day is missing', () => {
    expect(isWorkDayNoteModel({
      id_work_day_notes: 'n-1',
      note: 'hello',
    })).toBe(false);
  });
});
