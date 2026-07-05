import { EntityModelMapper } from '@/src/sellings/application/mappers/entity-model.mapper';
import { TRANSACTION_STATUS_ENUM } from '@/src/sellings/core/enums/route-status.enum';
import { ROUTE_TRANSACTION_OPERATION_TYPE } from '@/src/sellings/core/enums/route-transaction-operation-type.enum';
import { PaymentMethodObjectValue } from '@/src/sellings/core/value-objects/payment-method.object-value';
import { PaymentSchemaObjectValue } from '@/src/sellings/core/value-objects/payment-schema.object-value';
import { TransactionDescriptionObjectValue } from '@/src/sellings/core/value-objects/transaction-description.object-value';
import { TransactionEntity } from '@/src/sellings/core/entities/transaction.entity';
import type { PaymentMethodModel } from '@/src/sellings/application/models/payment.method.model';
import type { PaymentSchemaModel } from '@/src/sellings/application/models/payment-schema.model';
import type { TransactionDescriptionModel } from '@/src/sellings/application/models/transaction-description.model';

describe('EntityModelMapper', () => {
  const mapper = new EntityModelMapper();
  const baseTransactionModel = {
    id_transaction: 'tx-1',
    cfdi: null,
    state: TRANSACTION_STATUS_ENUM.ACTIVE,
    received_amount: 100,
    id_invoice_concept: null,
    created_at: '2026-01-01T00:00:00.000Z',
    latitude: '19.4',
    longitude: '-99.1',
    id_location: null,
    id_client: 'client-1',
    created_by: 'user-1',
    id_work_day: 'workday-1',
    id_payment_method: 'pm-1',
    id_payment_schema: 'ps-1',
  };

  const paymentMethodModel = { id_payment_method: 'pm-1', payment_method_name: 'Cash' };
  const paymentSchemaModel = { id_payment_schema: 'ps-1', payment_schema_type: 'Single payment' };
  const validDescriptionModels = [
    {
      id_transaction_description: 'td-1',
      price_at_moment: 10,
      cost_at_moment: 8,
      quantity: 1,
      created_at: '2026-01-01T00:00:00.000Z',
      id_transaction: 'tx-1',
      id_transaction_operation_type: ROUTE_TRANSACTION_OPERATION_TYPE.SALES,
      id_product: 'prod-1',
    },
  ];

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
    const entity = mapper.toDomainObject(
      baseTransactionModel,
      paymentMethodModel,
      paymentSchemaModel,
      validDescriptionModels,
    );

    expect(entity).toBeInstanceOf(TransactionEntity);
    expect(entity.id_transaction).toBe('tx-1');
    expect(entity.transaction_descriptions).toHaveLength(1);
  });

  it('throws when mapping transaction model without payment method model', () => {
    expect(() =>
      mapper.toDomainObject(
        baseTransactionModel,
        undefined as unknown as PaymentMethodModel,
        paymentSchemaModel,
        validDescriptionModels,
      ),
    ).toThrow('Missing payment method for TransactionModel to domain object conversion.');
  });

  it('throws when mapping transaction model without payment schema model', () => {
    expect(() =>
      mapper.toDomainObject(
        baseTransactionModel,
        paymentMethodModel,
        undefined as unknown as PaymentSchemaModel,
        validDescriptionModels,
      ),
    ).toThrow('Missing payment schema for TransactionModel to domain object conversion');
  });

  it('throws when mapping transaction model without transaction descriptions', () => {
    expect(() =>
      mapper.toDomainObject(
        baseTransactionModel,
        paymentMethodModel,
        paymentSchemaModel,
        undefined as unknown as TransactionDescriptionModel[],
      ),
    ).toThrow('Missing nested models for TransactionModel to domain object conversion.');
  });

  it('throws when one transaction description model has invalid shape', () => {
    expect(() =>
      mapper.toDomainObject(
        baseTransactionModel,
        paymentMethodModel,
        paymentSchemaModel,
        [{ ...validDescriptionModels[0], quantity: '1' } as unknown as TransactionDescriptionModel],
      ),
    ).toThrow('Missing nested models for TransactionModel to domain object conversion.');
  });

  it('throws when transaction model created_at has invalid format', () => {
    expect(() =>
      mapper.toDomainObject(
        { ...baseTransactionModel, created_at: 'invalid-date' as unknown as Date },
        paymentMethodModel,
        paymentSchemaModel,
        validDescriptionModels,
      ),
    ).toThrow('Invalid TransactionModel.created_at format');
  });

  it('throws when transaction model state is invalid', () => {
    expect(() =>
      mapper.toDomainObject(
        { ...baseTransactionModel, state: 999 },
        paymentMethodModel,
        paymentSchemaModel,
        validDescriptionModels,
      ),
    ).toThrow('Invalid state in TransactionModel');
  });

  it('throws when latitude and longitude are not both strings', () => {
    expect(() =>
      mapper.toDomainObject(
        { ...baseTransactionModel, latitude: null, longitude: '-99.1' },
        paymentMethodModel,
        paymentSchemaModel,
        validDescriptionModels,
      ),
    ).toThrow('TransactionModel latitude and longitude are required for domain conversion');
  });

  it('throws when nested description has invalid operation type enum', () => {
    expect(() =>
      mapper.toDomainObject(
        baseTransactionModel,
        paymentMethodModel,
        paymentSchemaModel,
        [{ ...validDescriptionModels[0], id_transaction_operation_type: 'invalid-op-id' }],
      ),
    ).toThrow('Invalid id_transaction_operation_type in TransactionDescriptionModel');
  });

  it('throws when route transaction operation type model has invalid enum value', () => {
    expect(() =>
      mapper.toDomainObject({
        id_route_transaction_operation_type: 'op-1',
        transcation_operation_type_name: 'invalid-type',
      }),
    ).toThrow('Invalid transcation_operation_type_name in RouteTransactionOperationTypeModel');
  });
});
