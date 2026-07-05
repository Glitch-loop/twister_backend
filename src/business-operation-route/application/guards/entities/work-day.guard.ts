// Entities
import type { WorkDayEntity } from '@/src/business-operation-route/core/entities/work-day.entity';

// Guards
import { isNoteObjectValue } from '@/src/business-operation-route/application/guards/object-values/note.guard';

// Utils
import { isRecord } from '@/src/shared/application/guards/utils';

export const isWorkDayEntity = (value: unknown): value is WorkDayEntity => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id_work_day === 'string' &&
    value.start_date instanceof Date &&
    typeof value.start_petty_cash === 'number' &&
    typeof value.id_route_day === 'string' &&
    typeof value.id_user === 'string' &&
    Array.isArray(value.notes) && value.notes.every(isNoteObjectValue) &&
    (value.finish_date === null || value.finish_date instanceof Date) &&
    (value.final_petty_cash === null || typeof value.final_petty_cash === 'number') &&
    (value.id_payment_stub === null || typeof value.id_payment_stub === 'string')
  );
};
