import type { WorkDayEntity } from '@/src/core/entities/work-day.entity';
import { isRecord } from '@/src/shared/application/guards/utils';

export const isWorkDayEntity = (value: unknown): value is WorkDayEntity => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id_work_day === 'string' &&
    value.start_date instanceof Date &&
    typeof value.id_route === 'string' &&
    typeof value.start_petty_cash === 'number' &&
    typeof value.id_route_day === 'string' &&
    typeof value.id_user === 'string' &&
    (value.finish_date === undefined || value.finish_date instanceof Date) &&
    (value.final_petty_cash === undefined || typeof value.final_petty_cash === 'number') &&
    (value.id_payment_stub === undefined || typeof value.id_payment_stub === 'string')
  );
};
