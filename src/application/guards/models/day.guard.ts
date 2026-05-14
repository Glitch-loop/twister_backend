import type { DayModel } from '../../models/day.model';

import { isRecord } from '../utils';

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
