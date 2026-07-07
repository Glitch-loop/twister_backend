import { isWorkDayOperationHistoricDto } from '@/src/business-operation-route/application/guards/dtos/work-day-operation-historic.guard';
import { DAY_OPERATIONS_ENUM } from '@/src/business-operation-route/core/enums/day-operations.enum';

describe('isWorkDayOperationHistoricDto', () => {
  it('returns true for a valid historic dto', () => {
    expect(isWorkDayOperationHistoricDto({
      id_work_day_operation: 'op-1',
      created_at: '2024-01-01T09:00:00.000Z',
      id_location: null,
      id_route_transaction: null,
      id_inventory_operation: null,
      id_route_day: 'rd-1',
      latitude: '19.4',
      longitude: '-99.1',
      id_operation_type: DAY_OPERATIONS_ENUM.sales,
      id_day_operation_dependent: null,
      id_work_day: 'wd-1',
    })).toBe(true);
  });

  it('returns false when id_operation_type is not a valid enum value', () => {
    expect(isWorkDayOperationHistoricDto({
      id_work_day_operation: 'op-1',
      created_at: '2024-01-01T09:00:00.000Z',
      id_location: null,
      id_route_transaction: null,
      id_inventory_operation: null,
      id_route_day: 'rd-1',
      latitude: '19.4',
      longitude: '-99.1',
      id_operation_type: 'invalid',
      id_day_operation_dependent: null,
      id_work_day: 'wd-1',
    })).toBe(false);
  });
});
