import type { OrganizationStrategyDto } from '@/src/route-organization/application/dtos/route-day-organization-strategy.dto';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isOrganizationStrategyDto = (value: unknown): value is OrganizationStrategyDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_organization_strategy === 'string' &&
    typeof value.organization_strategy_name === 'string' &&
    typeof value.is_used === 'number'
  );
};
