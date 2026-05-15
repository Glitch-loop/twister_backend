import type { AssignedRouteDayEntity } from '@/src/core/entities/assigned-route-day.entity';
import { isRecord } from '@/src/shared/guards/utils';

export const isAssignedRouteDayEntity = (value: unknown): value is AssignedRouteDayEntity => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id_assigned_route_day === 'string' &&
    value.created_at instanceof Date &&
    typeof value.id_route_day === 'string' &&
    typeof value.id_user === 'string' &&
    (value.expired_at === undefined || value.expired_at instanceof Date)
  );
};
