import { BusinessOperationDayAggregate } from '@/src/business-operation-route/core/aggregates/business-operation-day.aggregate';
import { WorkDayOperationHistoricEntity } from '@/src/business-operation-route/core/entities/work-day-operation-historic.entity';
import { DAY_OPERATIONS_ENUM } from '@/src/business-operation-route/core/enums/day-operations.enum';
import { BusinessRuleException } from '@/src/shared/errors/BusinessRuleException';

describe('BusinessOperationDayAggregate', () => {
  const makeBaseParams = (overrides?: Partial<{
    id_work_day_operation: string;
    id_operation_type: DAY_OPERATIONS_ENUM;
    id_location: string | null;
    id_route_transaction: string | null;
    id_inventory_operation: string | null;
    id_day_operation_dependent: string | null;
    created_at: Date;
  }>) => ({
    id_work_day_operation: overrides?.id_work_day_operation ?? 'op-1',
    id_work_day: 'wd-1',
    id_operation_type: overrides?.id_operation_type ?? DAY_OPERATIONS_ENUM.route_client_attention,
    created_at: overrides?.created_at ?? new Date('2024-01-01T08:00:00.000Z'),
    latitude: '19.4',
    longitude: '-99.1',
    id_location: overrides?.id_location ?? 'loc-1',
    id_route_transaction: overrides?.id_route_transaction ?? null,
    id_inventory_operation: overrides?.id_inventory_operation ?? null,
    id_route_day: 'rd-1',
    id_day_operation_dependent: overrides?.id_day_operation_dependent ?? null,
  });

  it('registers route client attention and exposes new operations when initialized with null', () => {
    const aggregate = new BusinessOperationDayAggregate(null);

    aggregate.createBusinessOperation(makeBaseParams());

    const operations = aggregate.getDayOperations();
    expect(operations).toHaveLength(1);
    expect(operations?.[0]).toBeInstanceOf(WorkDayOperationHistoricEntity);
    expect(aggregate.getNewDayOperations()).toHaveLength(1);
  });

  it('throws when route client attention is missing id_location', () => {
    const aggregate = new BusinessOperationDayAggregate(null);

    expect(() =>
      aggregate.createBusinessOperation(
        makeBaseParams({ id_location: null, id_operation_type: DAY_OPERATIONS_ENUM.route_client_attention }),
      ),
    ).toThrow(new BusinessRuleException('id_location is required for route client attention operations.'));
  });

  it('throws for unsupported operation type', () => {
    const aggregate = new BusinessOperationDayAggregate(null);

    expect(() =>
      aggregate.createBusinessOperation(
        makeBaseParams({ id_operation_type: 'bad-type' as unknown as DAY_OPERATIONS_ENUM }),
      ),
    ).toThrow(new BusinessRuleException('Unsupported business operation type.'));
  });

  it('requires route transaction id for route transaction operations', () => {
    const aggregate = new BusinessOperationDayAggregate(null);

    expect(() =>
      aggregate.createBusinessOperation(
        makeBaseParams({
          id_operation_type: DAY_OPERATIONS_ENUM.route_transaction,
          id_route_transaction: null,
        }),
      ),
    ).toThrow(new BusinessRuleException('id_route_transaction is required for route transaction operations.'));
  });

  it('requires inventory operation id for inventory operations', () => {
    const aggregate = new BusinessOperationDayAggregate(null);

    expect(() =>
      aggregate.createBusinessOperation(
        makeBaseParams({
          id_operation_type: DAY_OPERATIONS_ENUM.start_shift_inventory,
          id_inventory_operation: null,
        }),
      ),
    ).toThrow(new BusinessRuleException('id_inventory_operation is required for an inventory movement.'));
  });

  it('getNewDayOperations excludes initial operations', () => {
    const existing = [
      new WorkDayOperationHistoricEntity(
        'existing-1',
        DAY_OPERATIONS_ENUM.route_client_attention,
        new Date('2024-01-01T07:00:00.000Z'),
        'wd-1',
        '19.4',
        '-99.1',
        'loc-1',
        null,
        null,
        'rd-1',
        null,
      ),
    ];
    const aggregate = new BusinessOperationDayAggregate(existing);

    aggregate.createBusinessOperation(makeBaseParams({ id_work_day_operation: 'new-1' }));

    const newOps = aggregate.getNewDayOperations();
    expect(newOps).toHaveLength(1);
    expect(newOps?.[0].id_work_day_operation).toBe('new-1');
  });

  it('returns undefined when requesting last operation by type from empty day', () => {
    const aggregate = new BusinessOperationDayAggregate(null);

    expect(
      aggregate.getLastOperationByTypeBeforeCurrentOperation('missing', new Set([DAY_OPERATIONS_ENUM.sales])),
    ).toBeUndefined();
  });

  it('throws when current operation id does not exist in history', () => {
    const existing = [
      new WorkDayOperationHistoricEntity(
        'existing-1',
        DAY_OPERATIONS_ENUM.route_client_attention,
        new Date('2024-01-01T07:00:00.000Z'),
        'wd-1',
        '19.4',
        '-99.1',
        'loc-1',
        null,
        null,
        'rd-1',
        null,
      ),
    ];
    const aggregate = new BusinessOperationDayAggregate(existing);

    expect(() =>
      aggregate.getLastOperationByTypeBeforeCurrentOperation('missing', new Set([DAY_OPERATIONS_ENUM.sales])),
    ).toThrow(new BusinessRuleException('Current operation with id missing does not exist in this work day flow.'));
  });

  it('finds last operation by requested type before current operation', () => {
    const existing = [
      new WorkDayOperationHistoricEntity(
        'op-1',
        DAY_OPERATIONS_ENUM.route_client_attention,
        new Date('2024-01-01T07:00:00.000Z'),
        'wd-1',
        '19.4',
        '-99.1',
        'loc-1',
        null,
        null,
        'rd-1',
        null,
      ),
      new WorkDayOperationHistoricEntity(
        'op-2',
        DAY_OPERATIONS_ENUM.sales,
        new Date('2024-01-01T08:00:00.000Z'),
        'wd-1',
        null,
        null,
        null,
        'rt-1',
        null,
        'rd-1',
        null,
      ),
      new WorkDayOperationHistoricEntity(
        'op-3',
        DAY_OPERATIONS_ENUM.sample,
        new Date('2024-01-01T09:00:00.000Z'),
        'wd-1',
        null,
        null,
        null,
        'rt-2',
        null,
        'rd-1',
        null,
      ),
    ];

    const aggregate = new BusinessOperationDayAggregate(existing);

    const previous = aggregate.getLastOperationByTypeBeforeCurrentOperation(
      'op-3',
      new Set([DAY_OPERATIONS_ENUM.sales]),
    );

    expect(previous?.id_work_day_operation).toBe('op-2');
  });

  it('returns current operation when there is one route client attention without dependents', () => {
    const existing = [
      new WorkDayOperationHistoricEntity(
        'op-1',
        DAY_OPERATIONS_ENUM.route_client_attention,
        new Date('2024-01-01T07:00:00.000Z'),
        'wd-1',
        '19.4',
        '-99.1',
        'loc-1',
        null,
        null,
        'rd-1',
        null,
      ),
    ];

    const aggregate = new BusinessOperationDayAggregate(existing);
    const current = aggregate.determineCurrentOperation();

    expect(current?.id_work_day_operation).toBe('op-1');
  });
});
