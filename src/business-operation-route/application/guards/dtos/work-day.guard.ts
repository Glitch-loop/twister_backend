import type { WorkDayDto } from '@/src/business-operation-route/application/dtos/work-day.dto';

import { isWorkDayNoteDto } from '@/src/business-operation-route/application/guards/dtos/work-day-note.guard';
import { isRecord } from '@/src/shared/application/guards/utils';

export const isWorkDayDto = (value: unknown): value is WorkDayDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_work_day === 'string' &&
    typeof value.id_route === 'string' &&
    typeof value.start_petty_cash === 'number' &&
    typeof value.id_route_day === 'string' &&
    typeof value.id_user === 'string' &&
    Array.isArray(value.notes) &&
    value.notes.every(isWorkDayNoteDto) &&
    (value.final_petty_cash === null || typeof value.final_petty_cash === 'number') &&
    (value.id_payment_stub === null || typeof value.id_payment_stub === 'string')
  );
};
