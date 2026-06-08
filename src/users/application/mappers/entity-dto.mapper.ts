 
// Libraries
import { Injectable } from '@nestjs/common';

// Enums
import { ROLES_ENUM } from '@/src/users/core/enums/roles.enum';

// Dtos
import { UserDto } from '@/src/users/application/dtos/user.dto';

// Entities
import { UserEntity } from '@/src/users/core/entities/user.entity';

// Object values
import { AssignedRoleObjectValue } from '@/src/users/core/object-values/assigned-role.object-value';

// Entities guards
import { isUserEntity } from '@/src/users/application/guards/entities/user.guard';

// Models guards
import { isUserDto } from '@/src/users/application/guards/dtos/user.guard';

@Injectable()
export class Mapper {
  constructor() {}

  // ==================== OVERLOADED FUNCTIONS FOR MAPPING ====================
  // toDomainObject overloads
  toDomainObject(dto: UserDto): UserEntity;
  toDomainObject(dto: UserDto): any {
    if (isUserDto(dto)) {
      return this.userDtoToEntity(dto);
    }
    throw new Error('Invalid input for mapping to domain object');
  }

  // toModel overloads
  toDto(domainObject: UserEntity): UserDto;
  toDto(domainObject: UserEntity): any
  {
    if (isUserEntity(domainObject)) {
      return this.userEntityToDto(domainObject);
    }
    
    throw new Error('Invalid input for mapping to model');
  
  }

  // ==================== MAPPER METHODS DOMAIN OBJECT to DTO ====================
  userEntityToDto(entity: UserEntity): UserDto {
    return {
      id_user: entity.id_user,
      cellphone: entity.cellphone,
      name: entity.name,
      password: entity.password,
      status: entity.status,
      salary: entity.salary,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      assigned_roles: entity.assignedRoles.map((assignedRole) => assignedRole.role),
      address: entity.address,
      rfc: entity.rfc,
      imss: entity.imss,
    };
  }
  
  // ==================== MAPPER METHODS DTO to DOMAIN OBJECT ====================
  userDtoToEntity(dto: UserDto): UserEntity {
    return new UserEntity(
      dto.id_user,
      dto.cellphone,
      dto.name,
      dto.password,
      dto.status,
      dto.salary,
      dto.created_at instanceof Date ? dto.created_at : new Date(dto.created_at),
      dto.updated_at instanceof Date ? dto.updated_at : new Date(dto.updated_at),
      dto.assigned_roles.map((role) => {
        if (!Object.values(ROLES_ENUM).includes(role)) {
          throw new Error(`Invalid role in UserDto.assigned_roles: ${role}`);
        }

        return new AssignedRoleObjectValue(
          `${dto.id_user}-${role}`,
          role,
          dto.created_at instanceof Date ? dto.created_at : new Date(dto.created_at),
          dto.id_user,
        );
      }),
      dto.address,
      dto.rfc,
      dto.imss,
    );
  }  
}
