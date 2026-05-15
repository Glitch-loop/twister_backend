 
// Libraries
import { Injectable } from '@nestjs/common';

// Enums
import { CLIENT_STATUS_ENUM } from '@/src/clients/core/enums/client-status.enum';

// Dtos

// Entities
import { LocationEntity } from '@/src/clients/core/entities/location.entity';
import { TaxClientInformationEntity } from '@/src/clients/core/entities/tax-client-information.entity';

// Object values
import { NoteObjectValue } from '@/src/core/object-values/note.object-value';
import { LocationTypeObjectValue } from '@/src/core/object-values/location-type.object-value';

// Dtos guards

// Entities guards
import { isLocationEntity } from '@/src/clients/application/guards/entities/location.guard';
import { isTaxClientInformationEntity } from '@/src/clients/application/guards/entities/tax-client-information.guard';
import { isNoteObjectValue } from '@/src/application/guards/object-values/note.guard';
import { isLocationTypeObjectValue } from '@/src/application/guards/object-values/location-type.guard';

// Models guards
import { isUserModel } from '@/src/users/application/guards/models/user.guard';

@Injectable()
export class Mapper {
  constructor() {}

  // ==================== OVERLOADED FUNCTIONS FOR MAPPING ====================
  // toDomainObject overloads
  toDomainObject(dto: unknown): void;
  toDomainObject(dto: unknown): void {
    throw new Error('Invalid input for mapping to domain object');
  }

  // toModel overloads
  toDto(domainObject: UserEntity): void;
  toDto(domainObject: UserEntity): void
  {  
    throw new Error('Invalid input for mapping to model');
  
  }


  // ==================== MAPPER METHODS DOMAIN OBJECT to DTO ====================

  // ==================== MAPPER METHODS DTO to DOMAIN OBJECT ====================
  
}
