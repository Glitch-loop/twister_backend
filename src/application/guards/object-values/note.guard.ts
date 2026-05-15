import type { NoteObjectValue } from '@/src/core/object-values/note.object-value';
import { isRecord } from '@/src/shared/guards/utils';

export const isNoteObjectValue = (value: unknown): value is NoteObjectValue => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_note === 'string' &&
    typeof value.note === 'string' &&
    typeof value.id_owner === 'string'
  );
};