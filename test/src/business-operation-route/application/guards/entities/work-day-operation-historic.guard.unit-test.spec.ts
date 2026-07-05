import { isWorkDayOperationHistoricEntity } from '@/src/business-operation-route/application/guards/entities/work-day-operation-historic.guard';
import { DAY_OPERATIONS_ENUM } from '@/src/business-operation-route/core/enums/day-operations.enum';

describe('isWorkDayOperationHistoricEntity', () => {
  it('returns true for a valid historic entity', () => {
    expect(isWorkDayOperationHistoricEntity({
      id_work_day_operation: 'op-1',
      id_operation_type: DAY_OPERATIONS_ENUM.sales,
      id_work_day: 'wd-1',
      latitude: '19.4',
      longitude: '-99.1',
      id_location: null,
      id_route_transaction: null,
      id_inventory_operation: null,
      id_route_day: 'rd-1',
      id_day_operation_dependent: null,
    })).toBe(true);
  });

  it('returns false when id_route_day is not a string', () => {
    expect(isWorkDayOperationHistoricEntity({
      id_work_day_operation: 'op-1',
      id_operation_type: DAY_OPERATIONS_ENUM.sales,
      id_work_day: 'wd-1',
      latitude: '19.4',
      longitude: '-99.1',
      id_location: null,
      id_route_transaction: null,
      id_inventory_operation: null,
      id_route_day: null,
      id_day_operation_dependent: null,
    })).toBe(false);
  });
});
