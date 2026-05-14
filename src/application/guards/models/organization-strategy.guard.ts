import type { OrganizationStrategyModel } from '@/src/application/models/organization-strategy.model';

import { isRecord } from '@/src/application/guards/utils';

export const isOrganizationStrategyModel = (value: unknown): value is OrganizationStrategyModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_organization_strategy === 'string' &&
    typeof value.organization_strategy_name === 'string' &&
    typeof value.is_used === 'number' &&
    value.created_at instanceof Date
  );
};
