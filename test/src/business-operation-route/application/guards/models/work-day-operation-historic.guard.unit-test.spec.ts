import { isWorkDayOperationHistoricModel } from '@/src/business-operation-route/application/guards/models/work-day-operation-historic.guard';
import { DAY_OPERATIONS_ENUM } from '@/src/business-operation-route/core/enums/day-operations.enum';

describe('isWorkDayOperationHistoricModel', () => {
  it('returns true for a valid historic model', () => {
    expect(isWorkDayOperationHistoricModel({
      id_work_day_operation: 'op-1',
      id_location: null,
      id_route_transaction: null,
      id_route_day: 'rd-1',
      id_operation_type: DAY_OPERATIONS_ENUM.sales,
      id_day_operation_dependent: null,
      id_work_day: 'wd-1',
      latitude: '19.4',
      longitude: '-99.1',
      id_inventory_operation: null,
    })).toBe(true);
  });

  it('returns false when id_operation_type is invalid', () => {
    expect(isWorkDayOperationHistoricModel({
      id_work_day_operation: 'op-1',
      id_location: null,
      id_route_transaction: null,
      id_route_day: 'rd-1',
      id_operation_type: 'invalid',
      id_day_operation_dependent: null,
      id_work_day: 'wd-1',
      latitude: '19.4',
      longitude: '-99.1',
      id_inventory_operation: null,
    })).toBe(false);
  });
});
