import type { TransactionDescriptionDto } from '@/src/sellings/application/dtos/transaction-description.dto';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isTransactionDescriptionDto = (value: unknown): value is TransactionDescriptionDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_transaction_description === 'string' &&
    typeof value.price_at_moment === 'number' &&
    typeof value.cost_at_moment === 'number' &&
    typeof value.quantity === 'number' &&
    typeof value.id_transaction === 'string' &&
    typeof value.id_transaction_operation_type === 'string' &&
    typeof value.id_product === 'string'
  );
};
