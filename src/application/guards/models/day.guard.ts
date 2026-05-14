import type { DayModel } from '@/src/application/models/day.model';

import { isRecord } from '@/src/application/guards/utils';

export const isDayModel = (value: unknown): value is DayModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_day === 'string' &&
    typeof value.day_name === 'string' &&
    typeof value.order_to_show === 'number'
  );
};
