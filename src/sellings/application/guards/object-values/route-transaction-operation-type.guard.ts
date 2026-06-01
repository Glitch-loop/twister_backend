import type { RouteTransactionOperationTypeObjectValue } from '@/src/sellings/core/value-objects/route-transaction-operation-type.object-value';
import { isRecord } from '@/src/shared/application/guards/utils';

export const isRouteTransactionOperationTypeObjectValue = (value: unknown): value is RouteTransactionOperationTypeObjectValue => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_route_transaction_operation_type === 'string' &&
    typeof value.transcation_operation_type_name === 'string'
  );
};