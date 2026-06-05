import type { TransactionDto } from '@/src/sellings/application/dtos/transaction.dto';

import { isPaymentMethodDto } from '@/src/sellings/application/guards/dtos/payment-method.guard';
import { isPaymentSchemaDto } from '@/src/sellings/application/guards/dtos/payment-schema.guard';
import { isTransactionDescriptionDto } from '@/src/sellings/application/guards/dtos/transaction-description.guard';
import { isRecord } from '@/src/shared/application/guards/utils';

export const isTransactionDto = (value: unknown): value is TransactionDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_transaction === 'string' &&
    (value.cfdi === null || typeof value.cfdi === 'string') &&
    typeof value.state === 'number' &&
    typeof value.received_amount === 'number' &&
    (value.id_invoice_concept === null || typeof value.id_invoice_concept === 'string') &&
    (value.latitude === null || typeof value.latitude === 'string') &&
    (value.longitude === null || typeof value.longitude === 'string') &&
    (value.id_location === null || typeof value.id_location === 'string') &&
    (value.id_client === null || typeof value.id_client === 'string') &&
    typeof value.id_work_day === 'string' &&
    isPaymentMethodDto(value.payment_method) &&
    isPaymentSchemaDto(value.payment_schema) &&
    Array.isArray(value.transaction_descriptions) &&
    value.transaction_descriptions.every((description) => isTransactionDescriptionDto(description))
  );
};
