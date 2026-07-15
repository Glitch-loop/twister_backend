 
// Libraries
import { Injectable } from '@nestjs/common';

// Dtos
import { LocationDto } from '@/src/clients/application/dtos/location.dto';
import { ClientDto } from '@/src/clients/application/dtos/client.dto';
import { FurnitureDto } from '@/src/clients/application/dtos/furniture.dto';
import { LocationNoteDto } from '@/src/clients/application/dtos/location-note.dto';
import { LocationTypeDto } from '@/src/clients/application/dtos/location-type.dto';

// Entities
import { LocationEntity } from '@/src/clients/core/entities/location.entity';
import { TaxClientInformationEntity } from '@/src/clients/core/entities/tax-client-information.entity';
import { FurnitureEntity } from '@/src/clients/core/entities/furniture.entity';

// Object values
import { NoteObjectValue } from '@/src/clients/core/object-values/note.object-value';
import { LocationTypeObjectValue } from '@/src/clients/core/object-values/location-type.object-value';

// Enums
import { LOCATION_STATUS_ENUM } from '@/src/clients/core/enums/client-status.enum';

// Dtos guards
import { isClientDto } from '@/src/clients/application/guards/dtos/client.guard';
import { isFurnitureDto } from '@/src/clients/application/guards/dtos/furniture.guard';
import { isLocationDto } from '@/src/clients/application/guards/dtos/location.guard';
import { isLocationNoteDto } from '@/src/clients/application/guards/dtos/location_note.guard';
import { isLocationTypeDto } from '../guards/dtos/location-type.guard';

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
    if (isClientDto(dto)) {
      return this.clientDtoToTaxClientInformationEntity(dto);
    }
    
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


  // toEnum
  toLocationStatusEnum(value: number): LOCATION_STATUS_ENUM {
    const LOCATION_STATUS_VALUES: LOCATION_STATUS_ENUM[] =
    Object.values(LOCATION_STATUS_ENUM).filter(
      (value): value is LOCATION_STATUS_ENUM => typeof value === 'number',
    );

    if (!LOCATION_STATUS_VALUES.includes(value)) {
      throw new Error(`Invalid status_location: ${value}`);
    }

    return value;
  }

  // ==================== MAPPER METHODS DOMAIN OBJECT to DTO ====================
  private locationEntityToDto(domainObject: LocationEntity): LocationDto {
    const { notes } = domainObject;
    return {
      id_location: domainObject.id_location,
      street: domainObject.street,
      ext_number: domainObject.ext_number,
      colony: domainObject.colony,
      postal_code: domainObject.postal_code,
      location_name: domainObject.location_name,
      latitude: domainObject.latitude,
      longitude: domainObject.longitude,
      status_location: domainObject.status_location,
      id_creator: domainObject.id_creator,
      id_client: domainObject.id_client,
      id_location_type: domainObject.location_type.id_location_type,
      created_at: domainObject.created_at,
      updated_at: domainObject.updated_at,
      notes: notes.map((note) => { return this.noteObjectValueToLocationNoteDto(note); }),
      address_reference: domainObject.address_reference,
    };
  }

  private furnitureEntityToDto(domainObject: FurnitureEntity): FurnitureDto {
    return {
      id_furniture: domainObject.id_furniture,
      delivered_date: domainObject.delivered_date,
      description_furniture: domainObject.description_furniture,
      id_location: domainObject.id_location,
    };
  }

  private noteObjectValueToLocationNoteDto(domainObject: NoteObjectValue): LocationNoteDto {
    if (domainObject.created_at === undefined) {
      throw new Error('Invalid input for mapping to DTO');
    }

    return new LocationNoteDto(
      domainObject.id_note,
      domainObject.note,
      domainObject.id_owner,
      domainObject.created_at,
    );
  }

  private locationTypeObjectValueToLocationTypeDto(
    domainObject: LocationTypeObjectValue,
  ): LocationTypeDto {
    return new LocationTypeDto(
      domainObject.id_location_type,
      domainObject.location_type_name,
      domainObject.created_at,
    ); 
  }

  private taxClientInformationEntityToClientDto(
    domainObject: TaxClientInformationEntity,
  ): ClientDto {
    return new ClientDto(
      domainObject.id_client,
      domainObject.legal_name,
      domainObject.postal_code,
      domainObject.fiscal_regime,
      domainObject.name,
      domainObject.cellphone,
      domainObject.email,
      domainObject.created_at,
      domainObject.updated_at,
    );
  };
  
  // ==================== MAPPER METHODS DTO to DOMAIN OBJECT ====================
  private clientDtoToTaxClientInformationEntity(dto: ClientDto): TaxClientInformationEntity {
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

  private furnitureDtoToFurnitureEntity(dto: FurnitureDto): FurnitureEntity {
    return new FurnitureEntity(
      dto.id_furniture,
      dto.delivered_date,
      dto.description_furniture,
      dto.id_location,
    );
  }

  private locationNoteDtoToNoteObjectValue(dto: LocationNoteDto): NoteObjectValue {
    return new NoteObjectValue(
      dto.id_location_note,
      dto.note,
      dto.id_location,
      dto.created_at,
    );
  }

  private locationTypeDtoToLocationTypeObjectValue(
    dto: LocationTypeDto,
  ): LocationTypeObjectValue {
    return new LocationTypeObjectValue(
      dto.id_location_type,
      dto.location_type_name,
      dto.created_at,
    );
  }

  private locationDtoToLocationEntity(dto: LocationDto): LocationEntity {
    if (!(dto.status_location in LOCATION_STATUS_ENUM)) {
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
