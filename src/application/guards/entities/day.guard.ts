import type { DayEntity } from '@/src/core/entities/day.entity';
import { isRecord } from '@/src/application/guards/utils';

export const isDayEntity = (value: unknown): value is DayEntity => {
  if (!isRecord(value)) return false;
  return (
    typeof value.day_name === 'string' &&
    typeof value.id_day === 'string' &&
    typeof value.order_to_show === 'number'
  );
};
