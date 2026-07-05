import { isRouteTransactionOperationTypeDto } from '@/src/sellings/application/guards/dtos/route-transaction-operation-type.guard';

describe('isRouteTransactionOperationTypeDto', () => {
  it('returns true for a valid route transaction operation type dto', () => {
    expect(isRouteTransactionOperationTypeDto({
      id_route_transaction_operation_type: 'op-1',
      transcation_operation_type_name: 'sales',
    })).toBe(true);
  });

  it('returns false when id_route_transaction_operation_type is missing', () => {
    expect(isRouteTransactionOperationTypeDto({
      transcation_operation_type_name: 'sales',
    })).toBe(false);
  });
});
