 
// Libraries
import { Injectable } from '@nestjs/common';

// Enums
import { CLIENT_STATUS_ENUM } from '@/src/clients/core/enums/client-status.enum';

// Dtos

// Entities
import { DayEntity } from '@/src/core/entities/day.entity';
import { LocationEntity } from '@/src/clients/core/entities/location.entity';
import { TaxClientInformationEntity } from '@/src/clients/core/entities/tax-client-information.entity';
import { UserEntity } from '@/src/users/core/entities/user.entity';

// Object values
import { NoteObjectValue } from '@/src/core/object-values/note.object-value';
import { LocationTypeObjectValue } from '@/src/core/object-values/location-type.object-value';

// Models
import { DayModel } from '@/src/application/models/day.model';
import { LocationModel } from '@/src/clients/application/models/location.model';
import { ClientModel } from '@/src/clients/application/models/client.model';
import { LocationTypeModel } from '@/src/clients/application/models/location-type.model';
import { LocationNoteModel } from '@/src/clients/application/models/location-note.model';
import { UserModel } from '@/src/users/application/models/user.model';

// Dtos guards

// Entities guards
import { isDayEntity } from '@/src/application/guards/entities/day.guard';
import { isLocationEntity } from '@/src/clients/application/guards/entities/location.guard';
import { isTaxClientInformationEntity } from '@/src/clients/application/guards/entities/tax-client-information.guard';
import { isNoteObjectValue } from '@/src/application/guards/object-values/note.guard';
import { isUserEntity } from '@/src/users/application/guards/entities/user.guard';

// Models guards
import { isDayModel } from '@/src/application/guards/models/day.guard';
import { isLocationModel } from '@/src/clients/application/guards/models/location.guard';
import { isClientModel } from '@/src/clients/application/guards/models/client.guard';
import { isLocationTypeModel } from '@/src/clients/application/guards/models/location-type.guard';
import { isLocationNoteModel } from '@/src/clients/application/guards/models/location-note.guard';
import { isLocationTypeObjectValue } from '@/src/clients/application/guards/object-values/location-type.guard';
import { isUserModel } from '@/src/users/application/guards/models/user.guard';

@Injectable()
export class Mapper {
  constructor() {}

  // ==================== OVERLOADED FUNCTIONS FOR MAPPING ====================
  // toDomainObject overloads
  toDomainObject(model: DayModel): DayEntity;
  toDomainObject(model: ClientModel): TaxClientInformationEntity;
  toDomainObject(model: LocationModel, locationTypeModel: LocationTypeModel, locationNotesModel: LocationNoteModel[]): LocationEntity;
  toDomainObject(model: UserModel): UserEntity;
  toDomainObject(model: LocationModel | ClientModel | DayModel | UserModel, locationTypeModel?: LocationTypeModel, locationNotesModel?: LocationNoteModel[]): LocationEntity | TaxClientInformationEntity | DayEntity | UserEntity {
    if (isDayModel(model)) {
      return this.dayModelToDomainObject(model);
    }
    if (isClientModel(model)) {
      return this.clientModelToDomainObject(model);
    }
    if (isLocationModel(model)) {
      if (isLocationTypeModel(locationTypeModel) && Array.isArray(locationNotesModel) && locationNotesModel.every(isLocationNoteModel)) { 
        return this.locationModelToDomainObject(model, locationTypeModel, locationNotesModel);
      }
    }
    if (isUserModel(model)) {
      return this.userModelToDomainObject(model);
    }
    throw new Error('Invalid input for mapping to domain object');
  }

  // toModel overloads
  toModel(domainObject: DayEntity): DayModel;
  toModel(domainObject: TaxClientInformationEntity): ClientModel;
  toModel(domainObject: LocationEntity): LocationModel;
  toModel(domainObject: NoteObjectValue, parentDomainObject: LocationEntity): LocationModel;
  toModel(domainObject: LocationTypeObjectValue): LocationTypeModel;
  toModel(domainObject: UserEntity): UserModel;
  toModel(domainObject: DayEntity | TaxClientInformationEntity | LocationEntity | NoteObjectValue | LocationTypeObjectValue | UserEntity, parentDomainObject?: LocationEntity): any
  {
    if (isDayEntity(domainObject)) {
      return this.dayDomainObjectToModel(domainObject);
    }
    if (isTaxClientInformationEntity(domainObject)) {
      return this.taxClientInformationEntityToModel(domainObject);
    }
    if (isLocationEntity(domainObject)) {
      return this.locationDomainObjectToModel(domainObject);
    }
    if (isUserEntity(domainObject)) {
      return this.userDomainObjectToModel(domainObject);
    }
    if(isNoteObjectValue(domainObject) && isLocationEntity(parentDomainObject)) {
      return this.noteDomainObjectToModel(domainObject, parentDomainObject);      
    }
    if(isLocationTypeObjectValue(domainObject)) {
      return this.locationTypeDomainObjectToModel(domainObject);
    }

    throw new Error('Invalid input for mapping to model');
  
  }
  
  // ==================== MAPPER METHODS DOMAIN OBJECT to MODEL ====================
  private dayDomainObjectToModel(domainObject: DayEntity): DayModel {
    return {
      id_day: domainObject.id_day,
      day_name: domainObject.day_name,
      order_to_show: domainObject.order_to_show,
    };
  }

  private taxClientInformationEntityToModel(domainObject: TaxClientInformationEntity): ClientModel {
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
  private dayModelToDomainObject(model: DayModel): DayEntity {
    return new DayEntity(
      model.day_name,
      model.id_day,
      model.order_to_show,
    );
  }

  private clientModelToDomainObject(model: ClientModel): TaxClientInformationEntity {
    console.log("Mapping client model to domain object: ", model);
    if (typeof model.created_at === 'string' && isNaN(Date.parse(model.created_at))) {
      throw new Error('Invalid created_at format in ClientModel');
    }
    if (typeof model.updated_at === 'string' && isNaN(Date.parse(model.updated_at))) {
      throw new Error('Invalid updated_at format in ClientModel');
    }

    return new TaxClientInformationEntity(
      model.id_client,
      model.legal_name,
      model.postal_code,
      model.fiscal_regime,
      model.name,
      model.cellphone,
      model.email,
      new Date(model.created_at),
      new Date(model.updated_at),
    );
  }

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
