import type { OrganizationStrategyEntity } from '@/src/core/entities/organization-strategy.entity';
import { isRecord } from '@/src/application/guards/utils';

export const isOrganizationStrategyEntity = (value: unknown): value is OrganizationStrategyEntity => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id_organization_strategy === 'string' &&
    typeof value.organization_strategy_name === 'string' &&
    typeof value.is_used === 'number' &&
    value.created_at instanceof Date
  );
};
