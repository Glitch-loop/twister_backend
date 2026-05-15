// Models
import type { UserModel } from '@/src/users/application/models/user.model';

// Utils
import { isRecord } from '@/src/shared/guards/utils';

export const isUserModel = (value: unknown): value is UserModel => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id_user === 'string' &&
    typeof value.cellphone === 'string' &&
    typeof value.name === 'string' &&
    typeof value.password === 'string' &&
    typeof value.status === 'number' &&
    typeof value.salary === 'number' &&
    (value.address === undefined || typeof value.address === 'string') &&
    (value.rfc === undefined || typeof value.rfc === 'string') &&
    (value.imss === undefined || typeof value.imss === 'string')
  );
};
