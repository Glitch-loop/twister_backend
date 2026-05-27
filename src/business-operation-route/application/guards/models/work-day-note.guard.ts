import type { WorkDayNoteModel } from '@/src/business-operation-route/application/models/work-day-note.model';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isWorkDayNoteModel = (value: unknown): value is WorkDayNoteModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_work_day_notes === 'string' &&
    typeof value.note === 'string' &&
    value.created_at instanceof Date &&
    typeof value.id_work_day === 'string'
  );
};
