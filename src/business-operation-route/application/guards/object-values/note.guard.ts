import { NoteObjectValue } from "@/src/business-operation-route/core/value-objects/note.object-value";

import { isRecord } from '@/src/shared/application/guards/utils';

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