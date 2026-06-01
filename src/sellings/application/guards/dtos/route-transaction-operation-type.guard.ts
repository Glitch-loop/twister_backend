import type { RouteTransactionOperationTypeDto } from '@/src/sellings/application/dtos/route-transaction-operation-type.dto';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isRouteTransactionOperationTypeDto = (value: unknown): value is RouteTransactionOperationTypeDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_route_transaction_operation_type === 'string' &&
    typeof value.transcation_operation_type_name === 'string'
  );
};
