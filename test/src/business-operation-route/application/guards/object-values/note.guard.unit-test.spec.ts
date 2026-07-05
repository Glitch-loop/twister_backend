import { isNoteObjectValue } from '@/src/business-operation-route/application/guards/object-values/note.guard';

describe('isNoteObjectValue', () => {
  it('returns true for a valid note object value shape', () => {
    expect(isNoteObjectValue({ id_note: 'n-1', note: 'text', id_owner: 'wd-1' })).toBe(true);
  });

  it('returns false for non-record values', () => {
    expect(isNoteObjectValue(null)).toBe(false);
  });
});
