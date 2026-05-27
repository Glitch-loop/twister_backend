import type { AssignedRouteDayEntity } from '@/src/route-organization/core/entities/assigned-route-day.entity';
import { isRecord } from '@/src/shared/application/guards/utils';

export const isAssignedRouteDayEntity = (value: unknown): value is AssignedRouteDayEntity => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id_assigned_route_day === 'string' &&
    typeof value.id_route_day === 'string' &&
    typeof value.id_user === 'string'
  );
};
