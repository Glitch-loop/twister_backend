import type { RouteDayEntity } from '@/src/core/entities/route-day.entity';
import { isRecord } from '@/src/application/guards/utils';

export const isRouteDayEntity = (value: unknown): value is RouteDayEntity => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id_route_day === 'string' &&
    typeof value.id_route === 'string' &&
    typeof value.id_day === 'string'
  );
};
