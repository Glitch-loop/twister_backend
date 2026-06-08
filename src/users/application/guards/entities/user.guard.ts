// Entities
import type { UserEntity } from '@/src/users/core/entities/user.entity';
import { isAssignedRoleObjectValue } from '@/src/users/application/guards/object-values/assigned-role.guard';

// Guards
import { isRecord } from '@/src/shared/application/guards/utils';

export const isUserEntity = (value: unknown): value is UserEntity => {
  if (!isRecord(value)) return false;
  return (
    typeof value.id_user === 'string' &&
    typeof value.cellphone === 'string' &&
    typeof value.name === 'string' &&
    typeof value.password === 'string' &&
    typeof value.status === 'number' &&
    typeof value.salary === 'number' &&
    value.created_at instanceof Date &&
    value.updated_at instanceof Date &&
    Array.isArray(value.assignedRoles) &&
    value.assignedRoles.every(isAssignedRoleObjectValue) &&
    (value.address === undefined || typeof value.address === 'string') &&
    (value.rfc === undefined || typeof value.rfc === 'string') &&
    (value.imss === undefined || typeof value.imss === 'string')
  );
};
