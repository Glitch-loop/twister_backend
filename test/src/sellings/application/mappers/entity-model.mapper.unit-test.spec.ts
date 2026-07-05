import { EntityModelMapper } from '@/src/sellings/application/mappers/entity-model.mapper';
import { TRANSACTION_STATUS_ENUM } from '@/src/sellings/core/enums/route-status.enum';
import { ROUTE_TRANSACTION_OPERATION_TYPE } from '@/src/sellings/core/enums/route-transaction-operation-type.enum';
import { PaymentMethodObjectValue } from '@/src/sellings/core/value-objects/payment-method.object-value';
import { PaymentSchemaObjectValue } from '@/src/sellings/core/value-objects/payment-schema.object-value';
import { TransactionDescriptionObjectValue } from '@/src/sellings/core/value-objects/transaction-description.object-value';
import { TransactionEntity } from '@/src/sellings/core/entities/transaction.entity';

describe('EntityModelMapper', () => {
  const mapper = new EntityModelMapper();

  it('maps transaction entity to transaction model', () => {
    const entity = new TransactionEntity(
      'tx-1',
      TRANSACTION_STATUS_ENUM.ACTIVE,
      100,
      new Date('2026-01-01T00:00:00.000Z'),
      'client-1',
      'user-1',
      'workday-1',
      new PaymentMethodObjectValue('pm-1', 'Cash'),
      new PaymentSchemaObjectValue('ps-1', 'Single payment'),
      [
        new TransactionDescriptionObjectValue(
          'td-1',
          10,
          8,
          1,
          new Date('2026-01-01T00:00:00.000Z'),
          'tx-1',
          ROUTE_TRANSACTION_OPERATION_TYPE.SALES,
          'prod-1',
        ),
      ],
      null,
      '19.4',
      '-99.1',
      null,
      null,
    );

    const model = mapper.toModel(entity);

    expect(model.id_transaction).toBe('tx-1');
    expect(model.id_payment_method).toBe('pm-1');
    expect(model.id_payment_schema).toBe('ps-1');
  });

  it('maps transaction model with nested models to transaction entity', () => {
    const model = {
      id_transaction: 'tx-1',
      cfdi: null,
      state: TRANSACTION_STATUS_ENUM.ACTIVE,
      received_amount: 100,
      id_invoice_concept: null,
      created_at: new Date('2026-01-01T00:00:00.000Z'),
      latitude: '19.4',
      longitude: '-99.1',
      id_location: null,
      id_client: 'client-1',
      created_by: 'user-1',
      id_work_day: 'workday-1',
      id_payment_method: 'pm-1',
      id_payment_schema: 'ps-1',
    };

    const entity = mapper.toDomainObject(
      model,
      { id_payment_method: 'pm-1', payment_method_name: 'Cash' },
      { id_payment_schema: 'ps-1', payment_schema_type: 'Single payment' },
      [
        {
          id_transaction_description: 'td-1',
          price_at_moment: 10,
          cost_at_moment: 8,
          quantity: 1,
          created_at: new Date('2026-01-01T00:00:00.000Z'),
          id_transaction: 'tx-1',
          id_transaction_operation_type: ROUTE_TRANSACTION_OPERATION_TYPE.SALES,
          id_product: 'prod-1',
        },
      ],
    );

    expect(entity).toBeInstanceOf(TransactionEntity);
    expect(entity.id_transaction).toBe('tx-1');
    expect(entity.transaction_descriptions).toHaveLength(1);
  });

  it('throws when mapping transaction model without nested models', () => {
    const model = {
      id_transaction: 'tx-1',
      cfdi: null,
      state: TRANSACTION_STATUS_ENUM.ACTIVE,
      received_amount: 100,
      id_invoice_concept: null,
      created_at: new Date('2026-01-01T00:00:00.000Z'),
      latitude: '19.4',
      longitude: '-99.1',
      id_location: null,
      id_client: 'client-1',
      created_by: 'user-1',
      id_work_day: 'workday-1',
      id_payment_method: 'pm-1',
      id_payment_schema: 'ps-1',
    };

    expect(() => mapper.toDomainObject(model as any)).toThrow(
      'Missing nested models for TransactionModel to domain object conversion',
    );
  });

  it('throws when route transaction operation type model has invalid enum value', () => {
    expect(() =>
      mapper.toDomainObject({
        id_route_transaction_operation_type: 'op-1',
        transcation_operation_type_name: 'invalid-type',
      } as any),
    ).toThrow('Invalid transcation_operation_type_name in RouteTransactionOperationTypeModel');
  });
});
