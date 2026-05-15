import type { TransactionDescriptionObjectValue } from '@/src/core/object-values/transaction-description.object-value';
import { isRecord } from '@/src/shared/guards/utils';

export const isTransactionDescriptionObjectValue = (value: unknown): value is TransactionDescriptionObjectValue => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_transaction_description === 'string' &&
    typeof value.price_at_moment === 'number' &&
    typeof value.cost_at_moment === 'number' &&
    typeof value.amount === 'number' &&
    value.created_at instanceof Date &&
    typeof value.id_transaction === 'string' &&
    typeof value.id_transaction_operation_type === 'string' &&
    typeof value.id_product === 'string'
  );
};