import type { TransactionDescriptionModel } from '@/src/application/models/transaction-description.model';

import { isRecord } from '@/src/shared/guards/utils';

export const isTransactionDescriptionModel = (value: unknown): value is TransactionDescriptionModel => {
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
