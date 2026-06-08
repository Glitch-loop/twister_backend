import type { AssignedRoleModel } from '@/src/users/application/models/assigned-role.model';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isAssignedRoleModel = (value: unknown): value is AssignedRoleModel => {
	if (!isRecord(value)) {
		return false;
	}

	return (
		typeof value.id_assigned_role === 'string'
		&& typeof value.role === 'number'
		&& typeof value.id_user === 'string'
	);
};
