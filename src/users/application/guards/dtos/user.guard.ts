// Models
import type { UserDto } from '@/src/users/application/dtos/user.dto';

// Utils
import { isRecord } from '@/src/shared/application/guards/utils';

export const isUserDto = (value: unknown): value is UserDto => {
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
    Array.isArray(value.assigned_roles) &&
    value.assigned_roles.every((role) => typeof role === 'number') &&
    (value.address === undefined || typeof value.address === 'string') &&
    (value.rfc === undefined || typeof value.rfc === 'string') &&
    (value.imss === undefined || typeof value.imss === 'string')
  );
};
