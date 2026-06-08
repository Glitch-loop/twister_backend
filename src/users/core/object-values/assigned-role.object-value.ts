import { ROLES_ENUM } from "@/src/users/core/enums/roles.enum";

export class AssignedRoleObjectValue {
  constructor(
    readonly id_assigned_role: string,
    readonly role: ROLES_ENUM,
    readonly created_at: Date,
    readonly id_user: string
  ) { }
}