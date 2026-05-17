import type { TransactionEntity } from '@/src/core/entities/transaction.entity';
import { isRecord } from '@/src/shared/application/guards/utils';

export const isTransactionEntity = (value: unknown): value is TransactionEntity => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id_transaction === 'string' &&
    typeof value.state === 'number' &&
    typeof value.amount === 'number' &&
    typeof value.id_invoice_concept === 'string' &&
    value.created_at instanceof Date &&
    typeof value.id_client === 'string' &&
    typeof value.id_work_day === 'string' &&
    typeof value.id_payment_method === 'string' &&
    typeof value.id_payment_schema === 'string' &&
    (value.cfdi === undefined || typeof value.cfdi === 'string') &&
    (value.id_location === undefined || typeof value.id_location === 'string')
  );
};
