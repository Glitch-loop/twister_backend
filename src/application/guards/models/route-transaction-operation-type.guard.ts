import type { RouteTransactionOperationTypeModel } from '../../models/route-transaction-operation-type.model';

import { isRecord } from '../utils';

export const isRouteTransactionOperationTypeModel = (value: unknown): value is RouteTransactionOperationTypeModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_route_transaction_operation_type === 'string' &&
    typeof value.transcation_operation_type_name === 'string'
  );
};
