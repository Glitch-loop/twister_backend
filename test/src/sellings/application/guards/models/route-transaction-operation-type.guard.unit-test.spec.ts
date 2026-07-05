import { isRouteTransactionOperationTypeModel } from '@/src/sellings/application/guards/models/route-transaction-operation-type.guard';

describe('isRouteTransactionOperationTypeModel', () => {
  it('returns true for a valid route transaction operation type model', () => {
    expect(isRouteTransactionOperationTypeModel({
      id_route_transaction_operation_type: 'op-1',
      transcation_operation_type_name: 'sales',
    })).toBe(true);
  });

  it('returns false when transcation_operation_type_name is not a string', () => {
    expect(isRouteTransactionOperationTypeModel({
      id_route_transaction_operation_type: 'op-1',
      transcation_operation_type_name: 10,
    })).toBe(false);
  });
});
