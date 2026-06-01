import type { TransactionEntity } from '@/src/sellings/core/entities/transaction.entity';

import { isPaymentMethodObjectValue } from '@/src/sellings/application/guards/object-values/payment-method.guard';
import { isPaymentSchemaObjectValue } from '@/src/sellings/application/guards/object-values/payment-schema.guard';
import { isTransactionDescriptionObjectValue } from '@/src/sellings/application/guards/object-values/transaction-description.guard';
import { isRecord } from '@/src/shared/application/guards/utils';

export const isTransactionEntity = (value: unknown): value is TransactionEntity => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_transaction === 'string' &&
    typeof value.state === 'number' &&
    typeof value.received_amount === 'number' &&
    typeof value.id_invoice_concept === 'string' &&
    typeof value.latitude === 'string' &&
    typeof value.longitude === 'string' &&
    typeof value.id_client === 'string' &&
    typeof value.id_work_day === 'string' &&
    isPaymentMethodObjectValue(value.payment_method) &&
    isPaymentSchemaObjectValue(value.payment_schema) &&
    Array.isArray(value.transaction_descriptions) &&
    value.transaction_descriptions.every((description) => isTransactionDescriptionObjectValue(description)) &&
    (value.cfdi === undefined || typeof value.cfdi === 'string') &&
    (value.id_location === undefined || typeof value.id_location === 'string')
  );
};