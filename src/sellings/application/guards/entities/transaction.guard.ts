import type { TransactionEntity } from '@/src/sellings/core/entities/transaction.entity';
import { TRANSACTION_STATUS_ENUM } from '@/src/sellings/core/enums/route-status.enum';
import { PaymentMethodObjectValue } from '@/src/sellings/core/value-objects/payment-method.object-value';
import { PaymentSchemaObjectValue } from '@/src/sellings/core/value-objects/payment-schema.object-value';
import { isRecord } from '@/src/shared/application/guards/utils';
import { isTransactionDescriptionObjectValue } from '../object-values/transaction-description.guard';

export const isTransactionEntity = (value: unknown): value is TransactionEntity => {
  if (!isRecord(value)) {
    return false;
  }
  
  return (
    typeof value.id_transaction === 'string' &&
    typeof value.state === 'number' && Object.values(TRANSACTION_STATUS_ENUM).includes(value.state) && 
    typeof value.received_amount === 'number' &&
    value.created_at instanceof Date &&
    typeof value.id_client === 'string' &&
    typeof value.created_by === 'string' &&
    typeof value.id_work_day === 'string' &&
    value.payment_method instanceof PaymentMethodObjectValue &&
    value.payment_schema instanceof PaymentSchemaObjectValue &&
    Array.isArray(value.transaction_descriptions) && value.transaction_descriptions.every(isTransactionDescriptionObjectValue) &&
    (value.id_invoice_concept === null || typeof value.id_invoice_concept === 'string') &&
    (value.latitude === null || typeof value.latitude === 'string') &&
    (value.longitude === null || typeof value.longitude === 'string') &&
    (value.cfdi === null || typeof value.cfdi === 'string') &&
    (value.id_location === null || typeof value.id_location === 'string')
  );
};