import type { WorkDayNoteDto } from '@/src/business-operation-route/application/dtos/work-day-note.dto';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isWorkDayNoteDto = (value: unknown): value is WorkDayNoteDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_note === 'string' &&
    typeof value.note === 'string' &&
    typeof value.id_owner === 'string'
  );
};
