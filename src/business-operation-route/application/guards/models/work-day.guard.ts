import type { WorkDayModel } from '@/src/business-operation-route/application/models/work-day.model';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isWorkDayModel = (value: unknown): value is WorkDayModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_work_day === 'string' &&
    typeof value.id_route === 'string' &&
    typeof value.start_petty_cash === 'number' &&
    (value.final_petty_cash === undefined || typeof value.final_petty_cash === 'number') &&
    typeof value.id_route_day === 'string' &&
    typeof value.id_user === 'string' &&
    (value.id_payment_stub === undefined || typeof value.id_payment_stub === 'string')
  );
};
