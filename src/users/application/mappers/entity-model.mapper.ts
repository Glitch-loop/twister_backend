 
// Libraries
import { Injectable } from '@nestjs/common';

// Enums
import { ROLES_ENUM } from '@/src/users/core/enums/roles.enum';

// Dtos

// Entities
import { UserEntity } from '@/src/users/core/entities/user.entity';

// Object values
import { AssignedRoleObjectValue } from '@/src/users/core/object-values/assigned-role.object-value';

// Models
import { UserModel } from '@/src/users/application/models/user.model';
import { AssignedRoleModel } from '@/src/users/application/models/assigned-role.model';

// Dtos guards

// Entities guards
import { isUserEntity } from '@/src/users/application/guards/entities/user.guard';

// Models guards
import { isUserModel } from '@/src/users/application/guards/models/user.guard';
import { isAssignedRoleModel } from '@/src/users/application/guards/models/assigned-role.guard';
import { isAssignedRoleObjectValue } from '@/src/users/application/guards/object-values/assigned-role.guard';

@Injectable()
export class Mapper {
  constructor() {}
  // ==================== OVERLOADED FUNCTIONS FOR MAPPING ====================
  // toDomainObject overloads
  toDomainObject(model: AssignedRoleModel): AssignedRoleObjectValue;
  toDomainObject(model: UserModel, assignedRolesModels?: AssignedRoleModel[]): UserEntity;
  toDomainObject(model: UserModel | AssignedRoleModel, assignedRolesModels?: AssignedRoleModel[]): any {
    console.log(model)
    if (isAssignedRoleModel(model)) {
      return this.assignedRoleModelToDomainObject(model);
    }
    if (isUserModel(model)) {
      if (assignedRolesModels === undefined) {
        return this.userModelToDomainObject(model, []);
      }

      if (Array.isArray(assignedRolesModels) && assignedRolesModels.every(isAssignedRoleModel)) {
        return this.userModelToDomainObject(model, assignedRolesModels);
      }
    }

    throw new Error('Invalid input for mapping to domain object');
  }

  // toModel overloads
  toModel(domainObject: AssignedRoleObjectValue): AssignedRoleModel;
  toModel(domainObject: UserEntity): UserModel;
  toModel(domainObject: UserEntity | AssignedRoleObjectValue): any
  {
    if (isUserEntity(domainObject)) {
      return this.userDomainObjectToModel(domainObject);
    }
    if (isAssignedRoleObjectValue(domainObject)) {
      return this.assignedRoleDomainObjectToModel(domainObject);
    }

    throw new Error('Invalid input for mapping to model');  
  }
  
  // ==================== MAPPER METHODS DOMAIN OBJECT to MODEL ====================
  private assignedRoleDomainObjectToModel(domainObject: AssignedRoleObjectValue): AssignedRoleModel {
    return {
      id_assigned_role: domainObject.id_assigned_role,
      role: domainObject.role,
      created_at: domainObject.created_at,
      id_user: domainObject.id_user,
    };
  }

  private userModelToDomainObject(model: UserModel, assignedRolesModels: AssignedRoleModel[]): UserEntity {
    if (typeof model.created_at === 'string' && isNaN(Date.parse(model.created_at))) {
      throw new Error('Invalid created_at format in UserModel');
    }
    if (typeof model.updated_at === 'string' && isNaN(Date.parse(model.updated_at))) {
      throw new Error('Invalid updated_at format in UserModel');
    }
    return new UserEntity(
      model.id_user,
      model.cellphone,
      model.name,
      model.password,
      model.status,
      model.salary,
      new Date(model.created_at),
      new Date(model.updated_at),
      assignedRolesModels.map((roleModel) => this.assignedRoleModelToDomainObject(roleModel)),
      model.address,
      model.rfc,
      model.imss,
    );
  }

  // ==================== MAPPER METHODS MODEL to DOMAIN OBJECT ====================
  private assignedRoleModelToDomainObject(model: AssignedRoleModel): AssignedRoleObjectValue {
    if (typeof model.created_at === 'string' && isNaN(Date.parse(model.created_at))) {
      throw new Error('Invalid created_at format in AssignedRoleModel');
    }

    if (!Object.values(ROLES_ENUM).includes(model.role)) {
      throw new Error('Invalid role in AssignedRoleModel');
    }

    return new AssignedRoleObjectValue(
      model.id_assigned_role,
      model.role,
      new Date(model.created_at),
      model.id_user,
    );
  }

  private userDomainObjectToModel(domainObject: UserEntity): UserModel {
    return {
      id_user: domainObject.id_user,
      cellphone: domainObject.cellphone,
      name: domainObject.name,
      password: domainObject.password,
      status: domainObject.status,
      salary: domainObject.salary,
      created_at: domainObject.created_at,
      updated_at: domainObject.updated_at,
      address: domainObject.address,
      rfc: domainObject.rfc,
      imss: domainObject.imss,
    };
  }
}
