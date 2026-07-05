import { isRouteTransactionOperationTypeObjectValue } from '@/src/sellings/application/guards/object-values/route-transaction-operation-type.guard';

describe('isRouteTransactionOperationTypeObjectValue', () => {
  it('returns true for a valid route transaction operation type object value', () => {
    expect(isRouteTransactionOperationTypeObjectValue({
      id_route_transaction_operation_type: 'op-1',
      transcation_operation_type_name: 'sales',
    })).toBe(true);
  });

  it('returns false when id_route_transaction_operation_type is not a string', () => {
    expect(isRouteTransactionOperationTypeObjectValue({
      id_route_transaction_operation_type: 1,
      transcation_operation_type_name: 'sales',
    })).toBe(false);
  });
});
