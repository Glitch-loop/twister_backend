 
// Libraries
import { Injectable } from '@nestjs/common';

// Dtos
import { LocationDto } from '../dtos/location.dto';
import { ClientDto } from '../dtos/client.dto';
import { FurnitureDto } from '../dtos/furniture.dto';
import { LocationNoteDto } from '../dtos/location_note.dto';
import { LocationTypeDto } from '../dtos/location_type.dto';

// Entities
import { LocationEntity } from '@/src/clients/core/entities/location.entity';
import { TaxClientInformationEntity } from '@/src/clients/core/entities/tax-client-information.entity';
import { FurnitureEntity } from '@/src/clients/core/entities/furniture.entity';

// Object values
import { NoteObjectValue } from '@/src/clients/core/object-values/note.object-value';
import { LocationTypeObjectValue } from '@/src/clients/core/object-values/location-type.object-value';

// Enums
import { CLIENT_STATUS_ENUM } from '@/src/clients/core/enums/client-status.enum';

// Dtos guards
import { isClientDto } from '@/src/clients/application/guards/dtos/client.guard';
import { isFurnitureDto } from '@/src/clients/application/guards/dtos/furniture.guard';
import { isLocationDto } from '@/src/clients/application/guards/dtos/location.guard';
import { isLocationNoteDto } from '@/src/clients/application/guards/dtos/location_note.guard';
import { isLocationTypeDto } from '@/src/clients/application/guards/dtos/location_type.guard';

// Entities guards
import { isFurnitureEntity } from '@/src/clients/application/guards/entities/furniture.guard';
import { isLocationEntity } from '@/src/clients/application/guards/entities/location.guard';
import { isTaxClientInformationEntity } from '@/src/clients/application/guards/entities/tax-client-information.guard';

// Object values guards
import { isLocationTypeObjectValue } from '@/src/clients/application/guards/object-values/location-type.guard';
import { isNoteObjectValue } from '@/src/clients/application/guards/object-values/note.guard';

@Injectable()
export class Mapper {
  constructor() {}

  // ==================== OVERLOADED FUNCTIONS FOR MAPPING ====================
  // toDomainObject overloads
  toDomainObject(_dto: LocationDto): LocationEntity;
  toDomainObject(_dto: ClientDto): TaxClientInformationEntity;
  toDomainObject(_dto: FurnitureDto): FurnitureEntity;
  toDomainObject(_dto: LocationNoteDto): NoteObjectValue;
  toDomainObject(_dto: LocationTypeDto): LocationTypeObjectValue;
  toDomainObject(dto: unknown): any {
    if (isLocationDto(dto)) {
      return this.locationDtoToLocationEntity(dto);
    }

    if (isFurnitureDto(dto)) {
      return this.furnitureDtoToFurnitureEntity(dto);
    }

    if (isLocationNoteDto(dto)) {
      return this.locationNoteDtoToNoteObjectValue(dto);
    }

    if (isLocationTypeDto(dto)) {
      return this.locationTypeDtoToLocationTypeObjectValue(dto);
    }

    throw new Error('Invalid input for mapping to domain object');
  }

  // toEntity overloads
  toEntity(_dto: ClientDto): TaxClientInformationEntity;
  toEntity(dto: ClientDto): any {
    if (isClientDto(dto)) {
      return this.clientDtoToTaxClientInformationEntity(dto);
    }
    
    throw new Error('Invalid input for mapping to entity');
  }

  // toDto overloads
  toDto(_domainObject: LocationEntity): LocationDto;
  toDto(_domainObject: TaxClientInformationEntity): ClientDto;
  toDto(_domainObject: FurnitureEntity): FurnitureDto;
  toDto(_domainObject: NoteObjectValue): LocationNoteDto;
  toDto(_domainObject: LocationTypeObjectValue): LocationTypeDto;
  toDto(domainObject: unknown): any {
    if (isLocationEntity(domainObject)) {
      return this.locationEntityToDto(domainObject);
    }

    if (isTaxClientInformationEntity(domainObject)) {
      return this.taxClientInformationEntityToClientDto(domainObject);
    }

    if (isFurnitureEntity(domainObject)) {
      return this.furnitureEntityToDto(domainObject);
    }

    if (isNoteObjectValue(domainObject)) {
      return this.noteObjectValueToLocationNoteDto(domainObject);
    }

    if (isLocationTypeObjectValue(domainObject)) {
      return this.locationTypeObjectValueToLocationTypeDto(domainObject);
    }
    
    throw new Error('Invalid input for mapping to DTO');

  }


  // ==================== MAPPER METHODS DOMAIN OBJECT to DTO ====================
  locationEntityToDto(domainObject: LocationEntity): LocationDto {
    return {
      id_location: domainObject.id_location,
      street: domainObject.street,
      ext_number: domainObject.ext_number,
      colony: domainObject.colony,
      postal_code: domainObject.postal_code,
      address_reference: domainObject.address_reference ?? undefined,
      location_name: domainObject.location_name,
      latitude: domainObject.latitude,
      longitude: domainObject.longitude,
      status_location: domainObject.status_location,
      id_creator: domainObject.id_creator,
      id_client: domainObject.id_client,
      id_location_type: domainObject.location_type.id_location_type,
      created_at: domainObject.created_at,
      updated_at: domainObject.updated_at,
    };
  }

  furnitureEntityToDto(domainObject: FurnitureEntity): FurnitureDto {
    return {
      id_furniture: domainObject.id_furniture,
      delivered_date: domainObject.delivered_date,
      description_furniture: domainObject.description_furniture,
      id_location: domainObject.id_location,
    };
  }

  noteObjectValueToLocationNoteDto(domainObject: NoteObjectValue): LocationNoteDto {
    if (domainObject.created_at === undefined) {
      throw new Error('Invalid input for mapping to DTO');
    }

    return {
      id_location_note: domainObject.id_note,
      note: domainObject.note,
      id_location: domainObject.id_owner,
      created_at: domainObject.created_at,
    };
  }

  locationTypeObjectValueToLocationTypeDto(
    domainObject: LocationTypeObjectValue,
  ): LocationTypeDto {
    return {
      id_location_type: domainObject.id_location_type,
      location_type_name: domainObject.location_type_name,
      created_at: domainObject.created_at,
    };
  }

  taxClientInformationEntityToClientDto(
    domainObject: TaxClientInformationEntity,
  ): ClientDto {
    return {
      id_client: domainObject.id_client,
      legal_name: domainObject.legal_name,
      postal_code: domainObject.postal_code,
      fiscal_regime: domainObject.fiscal_regime,
      name: domainObject.name,
      cellphone: domainObject.cellphone,
      email: domainObject.email,
      created_at: domainObject.created_at,
      updated_at: domainObject.updated_at,
    };
  }

  // ==================== MAPPER METHODS DTO to DOMAIN OBJECT ====================
  clientDtoToTaxClientInformationEntity(dto: ClientDto): TaxClientInformationEntity {
    return new TaxClientInformationEntity(
      dto.id_client,
      dto.legal_name,
      dto.postal_code,
      dto.fiscal_regime,
      dto.name,
      dto.cellphone,
      dto.email,
      dto.created_at,
      dto.updated_at,
    );
  }

  furnitureDtoToFurnitureEntity(dto: FurnitureDto): FurnitureEntity {
    return new FurnitureEntity(
      dto.id_furniture,
      dto.delivered_date,
      dto.description_furniture,
      dto.id_location,
    );
  }

  locationNoteDtoToNoteObjectValue(dto: LocationNoteDto): NoteObjectValue {
    return new NoteObjectValue(
      dto.id_location_note,
      dto.note,
      dto.id_location,
      dto.created_at,
    );
  }

  locationTypeDtoToLocationTypeObjectValue(
    dto: LocationTypeDto,
  ): LocationTypeObjectValue {
    return new LocationTypeObjectValue(
      dto.id_location_type,
      dto.location_type_name,
      dto.created_at,
    );
  }

  locationDtoToLocationEntity(dto: LocationDto): LocationEntity {
    if (!(dto.status_location in CLIENT_STATUS_ENUM)) {
      throw new Error('Invalid input for mapping to domain object');
    }

    return new LocationEntity(
      dto.id_location,
      dto.street,
      dto.ext_number,
      dto.colony,
      dto.postal_code,
      dto.location_name,
      dto.latitude,
      dto.longitude,
      dto.status_location,
      dto.id_creator,
      dto.id_client,
      dto.created_at,
      dto.updated_at,
      new LocationTypeObjectValue(dto.id_location_type, '', dto.created_at),
      [],
      dto.address_reference ?? null,
    );
  }
}
