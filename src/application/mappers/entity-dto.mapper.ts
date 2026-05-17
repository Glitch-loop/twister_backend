 
// Libraries
import { Injectable } from '@nestjs/common';

// Enums
import { LOCATION_STATUS_ENUM } from '@/src/clients/core/enums/client-status.enum';

// Dtos
import { UserDto } from '../../users/application/dtos/user.dto';

// Entities
import { DayEntity } from '@/src/core/entities/day.entity';
import { LocationEntity } from '@/src/clients/core/entities/location.entity';
import { TaxClientInformationEntity } from '@/src/clients/core/entities/tax-client-information.entity';
import { UserEntity } from '@/src/users/core/entities/user.entity';

// Object values
import { NoteObjectValue } from '@/src/core/object-values/note.object-value';
import { LocationTypeObjectValue } from '@/src/core/object-values/location-type.object-value';


// Dtos guards

// Entities guards
import { isDayEntity } from '@/src/application/guards/entities/day.guard';
import { isLocationEntity } from '@/src/clients/application/guards/entities/location.guard';
import { isTaxClientInformationEntity } from '@/src/clients/application/guards/entities/tax-client-information.guard';
import { isNoteObjectValue } from '@/src/application/guards/object-values/note.guard';
import { isUserEntity } from '@/src/users/application/guards/entities/user.guard';
import { isLocationTypeObjectValue } from '@/src/clients/application/guards/object-values/location-type.guard';

// Models guards
import { isUserModel } from '@/src/users/application/guards/models/user.guard';
import { isUserDto } from '../../users/application/guards/dtos/user.guard';

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
      dto.address,
      dto.rfc,
      dto.imss,
    );
  }
  
}
