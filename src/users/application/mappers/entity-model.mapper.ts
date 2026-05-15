 
// Libraries
import { Injectable } from '@nestjs/common';

// Enums

// Dtos

// Entities
import { UserEntity } from '@/src/users/core/entities/user.entity';

// Object values

// Models
import { UserModel } from '@/src/users/application/models/user.model';

// Dtos guards

// Entities guards
import { isUserEntity } from '@/src/users/application/guards/entities/user.guard';

// Models guards
import { isUserModel } from '@/src/users/application/guards/models/user.guard';

@Injectable()
export class Mapper {
  constructor() {}
  // ==================== OVERLOADED FUNCTIONS FOR MAPPING ====================
  // toDomainObject overloads
  toDomainObject(model: UserModel): UserEntity;
  toDomainObject(model: UserModel): UserEntity {
    if (isUserModel(model)) {
      return this.userModelToDomainObject(model);
    }
    throw new Error('Invalid input for mapping to domain object');
  }

  // toModel overloads
  toModel(domainObject: UserEntity): UserModel;
  toModel(domainObject: UserEntity): any
  {
    if (isUserEntity(domainObject)) {
      return this.userDomainObjectToModel(domainObject);
    }
    throw new Error('Invalid input for mapping to model');  
  }
  
  // ==================== MAPPER METHODS DOMAIN OBJECT to MODEL ====================
  private userModelToDomainObject(model: UserModel): UserEntity {
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
      model.address,
      model.rfc,
      model.imss,
    );
  }

  // ==================== MAPPER METHODS MODEL to DOMAIN OBJECT ====================
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
