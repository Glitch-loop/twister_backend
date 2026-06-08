import type { AssignedRoleObjectValue } from '@/src/users/core/object-values/assigned-role.object-value';

import { isRecord } from '@/src/shared/application/guards/utils';

export const isAssignedRoleObjectValue = (value: unknown): value is AssignedRoleObjectValue => {
	if (!isRecord(value)) {
		return false;
	}

	return (
		typeof value.id_assigned_role === 'string'
		&& typeof value.role === 'number'
		&& typeof value.id_user === 'string'
	);
};
