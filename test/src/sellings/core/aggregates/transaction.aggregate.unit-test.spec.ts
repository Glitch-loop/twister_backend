import { TransactionAggregate } from '@/src/sellings/core/aggregates/transaction.aggregate';
import { TRANSACTION_STATUS_ENUM } from '@/src/sellings/core/enums/route-status.enum';
import { ROUTE_TRANSACTION_OPERATION_TYPE } from '@/src/sellings/core/enums/route-transaction-operation-type.enum';
import { PaymentMethodObjectValue } from '@/src/sellings/core/value-objects/payment-method.object-value';
import { PaymentSchemaObjectValue } from '@/src/sellings/core/value-objects/payment-schema.object-value';
import { BusinessRuleException } from '@/src/shared/errors/BusinessRuleException';

describe('TransactionAggregate', () => {
  const paymentMethod = new PaymentMethodObjectValue('pm-1', 'Cash');
  const paymentSchema = new PaymentSchemaObjectValue('ps-1', 'Single payment');

  it('creates a new transaction when payment method and schema are valid', () => {
    const aggregate = new TransactionAggregate(undefined, [paymentMethod], [paymentSchema]);

    aggregate.createNewTransaction(
      'tx-1',
      100,
      new Date('2026-01-01T00:00:00.000Z'),
      'client-1',
      'workday-1',
      'pm-1',
      'ps-1',
      'user-1',
      null,
      '19.4',
      '-99.1',
      null,
      null,
    );

    const transaction = aggregate.getTransaction();

    expect(transaction.id_transaction).toBe('tx-1');
    expect(transaction.received_amount).toBe(100);
    expect(transaction.payment_method.id_payment_method).toBe('pm-1');
  });

  it('throws when creating a transaction with invalid payment method', () => {
    const aggregate = new TransactionAggregate(undefined, [paymentMethod], [paymentSchema]);

    expect(() =>
      aggregate.createNewTransaction(
        'tx-1',
        100,
        new Date('2026-01-01T00:00:00.000Z'),
        'client-1',
        'workday-1',
        'pm-unknown',
        'ps-1',
        'user-1',
        null,
        '19.4',
        '-99.1',
        null,
        null,
      ),
    ).toThrow(BusinessRuleException);
  });

  it('adds a route description to an initialized transaction', () => {
    const aggregate = new TransactionAggregate(undefined, [paymentMethod], [paymentSchema]);
    aggregate.createNewTransaction(
      'tx-1',
      100,
      new Date('2026-01-01T00:00:00.000Z'),
      'client-1',
      'workday-1',
      'pm-1',
      'ps-1',
      'user-1',
      null,
      '19.4',
      '-99.1',
      null,
      null,
    );

    aggregate.addRouteDescription(
      'td-1',
      10,
      8,
      1,
      new Date('2026-01-01T00:00:00.000Z'),
      'tx-1',
      ROUTE_TRANSACTION_OPERATION_TYPE.SALES,
      'prod-1',
    );

    expect(aggregate.getTransaction().transaction_descriptions).toHaveLength(1);
  });

  it('throws when adding route description without initialized transaction', () => {
    const aggregate = new TransactionAggregate();

    expect(() =>
      aggregate.addRouteDescription(
        'td-1',
        10,
        8,
        1,
        new Date('2026-01-01T00:00:00.000Z'),
        'tx-1',
        ROUTE_TRANSACTION_OPERATION_TYPE.SALES,
        'prod-1',
      ),
    ).toThrow('Transaction description cannot be added because transaction has not been initialized.');
  });

  it('cancels a transaction and marks it inactive', () => {
    const aggregate = new TransactionAggregate(undefined, [paymentMethod], [paymentSchema]);
    aggregate.createNewTransaction(
      'tx-1',
      100,
      new Date('2026-01-01T00:00:00.000Z'),
      'client-1',
      'workday-1',
      'pm-1',
      'ps-1',
      'user-1',
      null,
      '19.4',
      '-99.1',
      null,
      null,
    );

    aggregate.cancelTransaction();

    expect(aggregate.getTransaction().state).toBe(TRANSACTION_STATUS_ENUM.INACTIVE);
  });
});
