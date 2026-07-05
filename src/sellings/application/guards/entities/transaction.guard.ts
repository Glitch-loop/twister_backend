import type { TransactionEntity } from '@/src/sellings/core/entities/transaction.entity';
import { isRecord } from '@/src/shared/application/guards/utils';

export const isTransactionEntity = (value: unknown): value is TransactionEntity => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_transaction === 'string' &&
    typeof value.state === 'number' &&
    typeof value.received_amount === 'number' &&
    typeof value.id_client === 'string' &&
    typeof value.created_by === 'string' &&
    value.created_at instanceof Date &&
    typeof value.id_work_day === 'string' &&
    (value.id_invoice_concept === null || typeof value.id_invoice_concept === 'string') &&
    (value.latitude === null || typeof value.latitude === 'string') &&
    (value.longitude === null || typeof value.longitude === 'string') &&
    (value.cfdi === null || typeof value.cfdi === 'string') &&
    (value.id_location === null || typeof value.id_location === 'string')
  );
};