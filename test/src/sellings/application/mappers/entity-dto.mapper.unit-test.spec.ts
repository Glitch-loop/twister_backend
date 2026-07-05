import { EntityDtoMapper } from '@/src/sellings/application/mappers/entity-dto.mapper';
import { TRANSACTION_STATUS_ENUM } from '@/src/sellings/core/enums/route-status.enum';
import { ROUTE_TRANSACTION_OPERATION_TYPE } from '@/src/sellings/core/enums/route-transaction-operation-type.enum';
import { PaymentMethodObjectValue } from '@/src/sellings/core/value-objects/payment-method.object-value';
import { PaymentSchemaObjectValue } from '@/src/sellings/core/value-objects/payment-schema.object-value';
import { TransactionDescriptionObjectValue } from '@/src/sellings/core/value-objects/transaction-description.object-value';
import { TransactionEntity } from '@/src/sellings/core/entities/transaction.entity';
import { PaymentMethodDto } from '@/src/sellings/application/dtos/payment-method.dto';
import { PaymentSchemaDto } from '@/src/sellings/application/dtos/payment-schema.dto';
import { RouteTransactionOperationTypeDto } from '@/src/sellings/application/dtos/route-transaction-operation-type.dto';
import { TaxDto } from '@/src/sellings/application/dtos/tax.dto';
import { TransactionDescriptionDto } from '@/src/sellings/application/dtos/transaction-description.dto';
import { TransactionDto } from '@/src/sellings/application/dtos/transaction.dto';

describe('EntityDtoMapper', () => {
  const mapper = new EntityDtoMapper();

  it('maps transaction entity to transaction dto', () => {
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

    const dto = mapper.toDto(entity);

    expect(dto).toBeInstanceOf(TransactionDto);
    expect(dto.id_transaction).toBe('tx-1');
    expect(dto.transaction_descriptions).toHaveLength(1);
  });

  it('maps transaction dto to transaction entity', () => {
    const dto = new TransactionDto(
      'tx-1',
      TRANSACTION_STATUS_ENUM.ACTIVE,
      100,
      null,
      'user-1',
      new Date('2026-01-01T00:00:00.000Z'),
      'workday-1',
      new PaymentMethodDto('pm-1', 'Cash'),
      new PaymentSchemaDto('ps-1', 'Single payment'),
      [
        new TransactionDescriptionDto(
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
      'client-1',
      null,
      '19.4',
      '-99.1',
      null,
    );

    const entity = mapper.toDomainObject(dto);

    expect(entity).toBeInstanceOf(TransactionEntity);
    expect(entity.id_transaction).toBe('tx-1');
    expect(entity.transaction_descriptions).toHaveLength(1);
  });

  it('throws for invalid mapping input in toDomainObject', () => {
    expect(() => mapper.toDomainObject({ invalid: true } as any)).toThrow(
      'Invalid input for mapping to domain object',
    );
  });

  it('throws when transaction dto does not have required domain latitude and longitude', () => {
    const dto = new TransactionDto(
      'tx-1',
      TRANSACTION_STATUS_ENUM.ACTIVE,
      100,
      null,
      'user-1',
      new Date('2026-01-01T00:00:00.000Z'),
      'workday-1',
      new PaymentMethodDto('pm-1', 'Cash'),
      new PaymentSchemaDto('ps-1', 'Single payment'),
      [],
      'client-1',
      null,
      null,
      null,
      null,
    );

    expect(() => mapper.toDomainObject(dto)).toThrow(
      'TransactionDto latitude and longitude are required for domain conversion',
    );
  });

  it('maps payment method object value to dto and back', () => {
    const objectValue = new PaymentMethodObjectValue('pm-1', 'Cash');

    const dto = mapper.toDto(objectValue);
    const mappedBack = mapper.toDomainObject(dto);

    expect(dto).toBeInstanceOf(PaymentMethodDto);
    expect(mappedBack.id_payment_method).toBe('pm-1');
    expect(mappedBack.payment_method_name).toBe('Cash');
  });

  it('throws when route transaction operation type dto has invalid enum value', () => {
    const dto = new RouteTransactionOperationTypeDto('op-1', 'invalid');

    expect(() => mapper.toDomainObject(dto)).toThrow(
      'Invalid transcation_operation_type_name in RouteTransactionOperationTypeDto',
    );
  });

  it('throws when transaction description dto has invalid operation type', () => {
    const dto = new TransactionDescriptionDto(
      'td-1',
      10,
      8,
      1,
      new Date('2026-01-01T00:00:00.000Z'),
      'tx-1',
      'invalid-operation',
      'prod-1',
    );

    expect(() => mapper.toDomainObject(dto)).toThrow(
      'Invalid id_transaction_operation_type in TransactionDescriptionDto',
    );
  });

  it('throws when tax dto has invalid created_at value', () => {
    const dto = new TaxDto('tax-1', 'VAT', '16', 'not-a-date' as unknown as Date);

    expect(() => mapper.toDomainObject(dto)).toThrow('Invalid TaxDto.created_at format');
  });

  it('throws when transaction dto state is not a valid enum value', () => {
    const dto = new TransactionDto(
      'tx-1',
      999,
      100,
      null,
      'user-1',
      new Date('2026-01-01T00:00:00.000Z'),
      'workday-1',
      new PaymentMethodDto('pm-1', 'Cash'),
      new PaymentSchemaDto('ps-1', 'Single payment'),
      [],
      'client-1',
      null,
      '19.4',
      '-99.1',
      null,
    );

    expect(() => mapper.toDomainObject(dto)).toThrow('Invalid state in TransactionDto');
  });

  it('throws when transaction dto has null id_client for domain conversion', () => {
    const dto = new TransactionDto(
      'tx-1',
      TRANSACTION_STATUS_ENUM.ACTIVE,
      100,
      null,
      'user-1',
      new Date('2026-01-01T00:00:00.000Z'),
      'workday-1',
      new PaymentMethodDto('pm-1', 'Cash'),
      new PaymentSchemaDto('ps-1', 'Single payment'),
      [],
      null,
      null,
      '19.4',
      '-99.1',
      null,
    );

    expect(() => mapper.toDomainObject(dto)).toThrow(
      'TransactionDto id_client is required for domain conversion',
    );
  });

  it('throws for invalid mapping input in toDto', () => {
    expect(() => mapper.toDto({ invalid: true } as any)).toThrow(
      'Invalid input for mapping to dto',
    );
  });
});
