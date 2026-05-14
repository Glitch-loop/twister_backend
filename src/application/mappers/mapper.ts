/* eslint-disable prettier/prettier */
// Libraries
import { Injectable } from '@nestjs/common';

// Dtos

// Entities
import { LocationEntity } from '@/src/core/entities/location.entity';

// Object values
import { NoteObjectValue } from '@/src/core/object-values/note.object-value';

// Models
import { LocationModel } from '@/src/application/models/location.model';
import { LocationTypeModel } from '@/src/application/models/location-type.model';
import { LocationNoteModel } from '@/src/application/models/location-note.model';

// Dtos guards

// Entities guards
import { isLocationEntity } from '@/src/application/entities/location.guard';
import { isNoteObjectValue } from '@/src/application/guards/object-values/note.guard';

// Models guards
import { isLocationModel } from '@/src/application/guards/models/location.guard';
import { CLIENT_STATUS_ENUM } from '@/src/core/enums/client-status.enum';
import { isLocationTypeModel } from '../guards/models/location-type.guard';
import { isLocationNoteModel } from '../guards/models/location-note.guard';
import { LocationTypeObjectValue } from '@/src/core/object-values/location-type.object-value';
import { isLocationTypeObjectValue } from '../guards/object-values/location-type.guard';

@Injectable()
export class Mapper {
  constructor() {}

  // ==================== OVERLOADED FUNCTIONS FOR MAPPING ====================
  // toDomainObject overloads
  toDomainObject(model: LocationModel, locationTypeModel: LocationTypeModel, locationNotesModel: LocationNoteModel[]): LocationEntity {
    if(isLocationModel(model)) {
      if (isLocationTypeModel(locationTypeModel) && locationNotesModel.every(isLocationNoteModel)) { 
        return this.locationModelToDomainObject(model, locationTypeModel, locationNotesModel);
      }
    }

    throw new Error('Invalid input for mapping to domain object');
  }

  // toModel overloads
  toModel(domainObject: LocationEntity): LocationModel;
  toModel(domainObject: NoteObjectValue, parentDomainObject: LocationEntity): LocationModel;
  toModel(domainObject: LocationTypeObjectValue): LocationTypeModel;
  toModel(domainObject: LocationEntity | NoteObjectValue | LocationTypeObjectValue, parentDomainObject?: LocationEntity): any
  {
    if (isLocationEntity(parentDomainObject)) {
      return this.locationDomainObjectToModel(parentDomainObject);
    }
    if(isNoteObjectValue(domainObject) && isLocationEntity(parentDomainObject)) {
      return this.noteDomainObjectToModel(domainObject, parentDomainObject);      
    }
    if(isLocationTypeObjectValue(domainObject)) {
      return this.locationTypeDomainObjectToModel(domainObject);
    }
  }


  // ==================== MAPPER METHODS DOMAIN OBJECT to DTO ====================
  
  // ==================== MAPPER METHODS DTO to DOMAIN OBJECT ====================
  
  // ==================== MAPPER METHODS DOMAIN OBJECT to MODEL ====================
  private locationDomainObjectToModel(domainObject: LocationEntity): LocationModel {
    return {
      id_location: domainObject.id_location,
      street: domainObject.street,
      ext_number: domainObject.ext_number,
      colony: domainObject.colony,
      postal_code: domainObject.postal_code,
      address_reference: domainObject.address_reference || undefined,
      location_name: domainObject.location_name,
      latitude: domainObject.latitude,
      longitude: domainObject.longitude,
      status_location: domainObject.status_location,
      id_creator: domainObject.id_creator,
      id_client: domainObject.id_client,
      created_at: domainObject.created_at,
      updated_at: domainObject.updated_at,
    } as LocationModel;
  }

  private noteDomainObjectToModel(domainObject: NoteObjectValue, parentDomainObject: LocationEntity): LocationNoteModel {
    return {
      id_location_note: domainObject.id_note,
      note: domainObject.note,
      id_location: parentDomainObject.id_location,
      created_at: domainObject.created_at,
    } as LocationNoteModel;
  }

  private locationTypeDomainObjectToModel(domainObject: LocationTypeObjectValue): LocationTypeModel {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return {
      id_location_type: domainObject.id_location_type,
      location_type_name: domainObject.location_type_name,
      created_at: domainObject.created_at,
    } as LocationTypeModel;
  }

  // ==================== MAPPER METHODS MODEL to DOMAIN OBJECT ====================
  private locationModelToDomainObject(model: LocationModel, locationTypeModel: LocationTypeModel, locationNotesModel: LocationNoteModel[]): LocationEntity {
    if (typeof model.created_at === 'string' && isNaN(Date.parse(model.created_at))) {
      throw new Error('Invalid created_at format in LocationModel');
    }
    if (typeof model.updated_at === 'string' && isNaN(Date.parse(model.updated_at))) {
        throw new Error('Invalid updated_at format in LocationModel');
    }

    if (model.status_location in CLIENT_STATUS_ENUM === false) {
      throw new Error('Invalid status_location in LocationModel');
    }

    return new LocationEntity(
      model.id_location,
      model.street,
      model.ext_number,
      model.colony,
      model.postal_code,
      model.location_name,
      model.latitude,
      model.longitude,
      model.status_location,
      model.id_creator,
      model.id_client,
      new Date(model.created_at),
      new Date(model.updated_at),
      this.locationTypeModelToDomainObject(locationTypeModel),
      locationNotesModel.map(note => this.locationNoteModelToDomainObject(note)),
      model.address_reference || null,
    );
  }

  private locationTypeModelToDomainObject(model: LocationTypeModel): LocationTypeObjectValue {
    if (typeof model.created_at === 'string' && isNaN(Date.parse(model.created_at))) {
      throw new Error('Invalid created_at format in LocationTypeModel');
    }

    return new LocationTypeObjectValue(
      model.id_location_type,
      model.location_type_name,
      new Date(model.created_at)
    );
  }

  private locationNoteModelToDomainObject(model: LocationNoteModel): NoteObjectValue {
    if (typeof model.created_at === 'string' && isNaN(Date.parse(model.created_at))) {
      throw new Error('Invalid created_at format in LocationNoteModel');
    }

    return new NoteObjectValue(
      model.id_location_note,
      model.note,
      model.id_location,
      new Date(model.created_at)
    );
  }
}
