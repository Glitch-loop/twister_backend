import { isWorkDayNoteDto } from '@/src/business-operation-route/application/guards/dtos/work-day-note.guard';

describe('isWorkDayNoteDto', () => {
  it('returns true for a valid work day note dto', () => {
    expect(
      isWorkDayNoteDto({
        id_note: 'n-1',
        note: 'note',
        id_owner: 'wd-1',
        created_at: '2024-01-01T09:00:00.000Z',
      }),
    ).toBe(true);
  });

  it('returns false when note is missing', () => {
    expect(isWorkDayNoteDto({ id_note: 'n-1', id_owner: 'wd-1' })).toBe(false);
  });
});
