---
name: Register a transformation in the mapper.
description: This prompt is used when the user wants to register a transformation in the mapper.
---

This prompt is used when the user wants to register a transformation in the mapper. 
There are 4 types of transformations:
- From domain object to model.
- From model to domain object.
- From domain object to dto
- From dto to domain object.

# Input:
User will provide you with the following information:
- The type of transformation they want to register.
- The domain object, model or dto that they want to transform from.
- The domain object, model or dto that they want to transform to.

> Remember the schema will be used in a typescript application. So you have to define the schema in typescript.

# Steps to follow:
* Find the domain object/dto/model that the user refers
  - entities `@/src/core/entities`.
  - object values `@/src/core/object-values`.
  - models `@/src/application/models`.
* Find guards that validate an object is a specific domain object/dto/model, this will help you to understand the schema of the domain object/dto/model that you are going to transform.
  - guards for entities `@/src/application/guards/entities`.
  - guards for object values `@/src/application/guards/object-values`.
  - guards for models `@/src/application/guards/models`.
* Once you have identified the object implied and its respective guards, you have to understand the schema of the domain object/dto/model that you are going to transform, this is important because you have to use all the fields that compound the schema to make the transformation.
* You will set the transformation in the file located at `@/src/application/mappers/mapper.ts`.
* To register the transformation correctly first you have to split the process in two steps:
  1. Register the method that actually makes the converstion. This will be located in one of the following sections of the file `mapper.ts` depending on the type of transformation:
    - From domain object to model: this will be located in the section `// domain object to model transformations`.
    - From model to domain object: this will be located in the section `// model to domain object transformations`.
    - From domain object to dto: this will be located in the section `// domain object to dto transformations`.
    - From dto to domain object: this will be located in the section `// dto to domain object transformations`.
  2. Register the method signature in the overloads of the `toModel`, `toDomainObject`, `toDto` or `fromDto` methods depending on the type of transformation. For example, if you are registering a transformation from domain object to model, you have to register the method signature in the overloads of the `toModel` method.
* After registering the transformation, you have to create a test that validates the transformation.
- If the transformation is from domain object to model, you have to create the test in the file `test/src/application/mappers/mapper.domain-object-to-model.spec.ts`.
- If the transformation is from model to domain object, you have to create the test in the file `test/src/application/mappers/mapper.model-to-domain-object.spec.ts`.

# Example:
Here is an example of how the transformation should be registered in the `mapper.ts` file:
```typescript
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
```

> As you might notice, if the schema is composed, i.e an entity is composed by an object value this is handled as a separate transformation, declaring the function that makes the convertion (Step 1) and then declare it in the overloaded function (step 2) dependeding the case.

> In the same way, notice that it is used guards to validate and redirect the transformation to the correct function.

And once the transformation has been completed, you have to create a test that validates the transformation. If the transformation is from domain object to model, you have to create the test in the file `test/src/application/mappers/mapper.domain-object-to-model.spec.ts`. 
```Typescript
import { beforeEach, describe, expect, it } from '@jest/globals';

import { Mapper } from '@/src/application/mappers/mapper';
import { DayEntity } from '@/src/core/entities/day.entity';
import { LocationEntity } from '@/src/core/entities/location.entity';
import { TaxClientInformationEntity } from '@/src/core/entities/tax-client-information.entity';
import { UserEntity } from '@/src/core/entities/user.entity';
import { CLIENT_STATUS_ENUM } from '@/src/core/enums/client-status.enum';
import { LocationTypeObjectValue } from '@/src/core/object-values/location-type.object-value';
import { NoteObjectValue } from '@/src/core/object-values/note.object-value';

describe('Mapper.toModel', () => {
  let mapper: Mapper;

  beforeEach(() => {
    mapper = new Mapper();
  });

  it('maps DayEntity to DayModel', () => {
    const dayEntity = new DayEntity('Monday', 'day-1', 1);

    const result = mapper.toModel(dayEntity);

    expect(result).toEqual({
      id_day: 'day-1',
      day_name: 'Monday',
      order_to_show: 1,
    });
  });

  it('maps TaxClientInformationEntity to ClientModel', () => {
    const createdAt = new Date('2026-01-10T00:00:00.000Z');
    const updatedAt = new Date('2026-01-11T00:00:00.000Z');
    const taxClientInformationEntity = new TaxClientInformationEntity(
      'client-1',
      'Legal Name SA de CV',
      '64000',
      '601',
      'John Doe',
      '8181818181',
      'john@example.com',
      createdAt,
      updatedAt,
    );

    const result = mapper.toModel(taxClientInformationEntity);

    expect(result).toEqual({
      id_client: 'client-1',
      legal_name: 'Legal Name SA de CV',
      postal_code: '64000',
      fiscal_regime: '601',
      name: 'John Doe',
      cellphone: '8181818181',
      email: 'john@example.com',
      created_at: createdAt,
      updated_at: updatedAt,
    });
  });

  it('maps LocationEntity to LocationModel', () => {
    const createdAt = new Date('2026-01-01T00:00:00.000Z');
    const updatedAt = new Date('2026-01-02T00:00:00.000Z');
    const locationType = new LocationTypeObjectValue(
      'type-1',
      'Grocery',
      new Date('2026-01-03T00:00:00.000Z'),
    );
    const notes = [
      new NoteObjectValue(
        'note-1',
        'Bring samples',
        'location-1',
        new Date('2026-01-04T00:00:00.000Z'),
      ),
    ];
    const locationEntity = new LocationEntity(
      'location-1',
      'Main St',
      '123',
      'Downtown',
      '64000',
      'Store A',
      '25.68',
      '-100.31',
      CLIENT_STATUS_ENUM.CLIENT,
      'creator-1',
      'client-1',
      createdAt,
      updatedAt,
      locationType,
      notes,
      null,
    );

    const result = mapper.toModel(locationEntity);

    expect(result).toEqual({
      id_location: 'location-1',
      street: 'Main St',
      ext_number: '123',
      colony: 'Downtown',
      postal_code: '64000',
      address_reference: undefined,
      location_name: 'Store A',
      latitude: '25.68',
      longitude: '-100.31',
      status_location: CLIENT_STATUS_ENUM.CLIENT,
      id_creator: 'creator-1',
      id_client: 'client-1',
      created_at: createdAt,
      updated_at: updatedAt,
    });
  });

  it('maps NoteObjectValue to LocationNoteModel', () => {
    const createdAt = new Date('2026-01-05T00:00:00.000Z');
    const note = new NoteObjectValue(
      'note-1',
      'Call before arrival',
      'location-1',
      createdAt,
    );
    const locationEntity = new LocationEntity(
      'location-1',
      'Main St',
      '123',
      'Downtown',
      '64000',
      'Store A',
      '25.68',
      '-100.31',
      CLIENT_STATUS_ENUM.CLIENT,
      'creator-1',
      'client-1',
      new Date('2026-01-01T00:00:00.000Z'),
      new Date('2026-01-02T00:00:00.000Z'),
      new LocationTypeObjectValue(
        'type-1',
        'Grocery',
        new Date('2026-01-03T00:00:00.000Z'),
      ),
      [],
      null,
    );

    const result = mapper.toModel(note, locationEntity);

    expect(result).toEqual({
      id_location_note: 'note-1',
      note: 'Call before arrival',
      id_location: 'location-1',
      created_at: createdAt,
    });
  });

  it('maps LocationTypeObjectValue to LocationTypeModel', () => {
    const createdAt = new Date('2026-01-06T00:00:00.000Z');
    const locationType = new LocationTypeObjectValue(
      'type-1',
      'Pharmacy',
      createdAt,
    );

    const result = mapper.toModel(locationType);

    expect(result).toEqual({
      id_location_type: 'type-1',
      location_type_name: 'Pharmacy',
      created_at: createdAt,
    });
  });

  it('maps UserEntity to UserModel', () => {
    const createdAt = new Date('2026-01-07T00:00:00.000Z');
    const updatedAt = new Date('2026-01-08T00:00:00.000Z');
    const userEntity = new UserEntity(
      'user-1',
      '8180000000',
      'Jane User',
      'hashed-password',
      1,
      1500,
      createdAt,
      updatedAt,
      'Downtown 123',
      'XAXX010101000',
      'NSS12345678901',
    );

    const result = mapper.toModel(userEntity);

    expect(result).toEqual({
      id_user: 'user-1',
      cellphone: '8180000000',
      name: 'Jane User',
      password: 'hashed-password',
      status: 1,
      salary: 1500,
      created_at: createdAt,
      updated_at: updatedAt,
      address: 'Downtown 123',
      rfc: 'XAXX010101000',
      imss: 'NSS12345678901',
    });
  });
});

```

If the transformation is from model to domain object, you have to create the test in the file `test/src/application/mappers/mapper.model-to-domain-object.spec.ts`.
```Typescript
import { beforeEach, describe, expect, it } from '@jest/globals';

import { Mapper } from '@/src/application/mappers/mapper';
import { CLIENT_STATUS_ENUM } from '@/src/core/enums/client-status.enum';
import { DayEntity } from '@/src/core/entities/day.entity';
import { TaxClientInformationEntity } from '@/src/core/entities/tax-client-information.entity';
import { LocationEntity } from '@/src/core/entities/location.entity';
import { LocationTypeObjectValue } from '@/src/core/object-values/location-type.object-value';
import { NoteObjectValue } from '@/src/core/object-values/note.object-value';

describe('Mapper.toDomainObject', () => {
  let mapper: Mapper;

  beforeEach(() => {
    mapper = new Mapper();
  });

  it('maps DayModel to DayEntity', () => {
    const model = {
      id_day: 'day-1',
      day_name: 'Tuesday',
      order_to_show: 2,
    };

    const result = mapper.toDomainObject(model);

    expect(result).toBeInstanceOf(DayEntity);
    expect(result).toEqual(new DayEntity('Tuesday', 'day-1', 2));
  });

  it('maps ClientModel to TaxClientInformationEntity', () => {
    const createdAt = new Date('2026-02-10T00:00:00.000Z');
    const updatedAt = new Date('2026-02-11T00:00:00.000Z');
    const model = {
      id_client: 'client-1',
      legal_name: 'Legal Name SA de CV',
      postal_code: '64000',
      fiscal_regime: '601',
      name: 'Jane Doe',
      cellphone: '8181818181',
      email: 'jane@example.com',
      created_at: createdAt,
      updated_at: updatedAt,
    };

    const result = mapper.toDomainObject(model);

    expect(result).toBeInstanceOf(TaxClientInformationEntity);
    expect(result).toEqual(
      new TaxClientInformationEntity(
        'client-1',
        'Legal Name SA de CV',
        '64000',
        '601',
        'Jane Doe',
        '8181818181',
        'jane@example.com',
        createdAt,
        updatedAt,
      ),
    );
  });

  it('maps LocationModel + LocationTypeModel + LocationNoteModel[] to LocationEntity', () => {
    const locationCreatedAt = new Date('2026-03-01T00:00:00.000Z');
    const locationUpdatedAt = new Date('2026-03-02T00:00:00.000Z');
    const locationTypeCreatedAt = new Date('2026-03-03T00:00:00.000Z');
    const noteCreatedAt = new Date('2026-03-04T00:00:00.000Z');

    const locationModel = {
      id_location: 'location-1',
      street: 'Main St',
      ext_number: '123',
      colony: 'Downtown',
      postal_code: '64000',
      address_reference: 'Near the park',
      location_name: 'Store A',
      latitude: '25.68',
      longitude: '-100.31',
      status_location: CLIENT_STATUS_ENUM.CLIENT,
      id_creator: 'creator-1',
      id_client: 'client-1',
      id_location_type: 'type-1',
      created_at: locationCreatedAt,
      updated_at: locationUpdatedAt,
    };

    const locationTypeModel = {
      id_location_type: 'type-1',
      location_type_name: 'Grocery',
      created_at: locationTypeCreatedAt,
    };

    const locationNotesModel = [
      {
        id_location_note: 'note-1',
        note: 'Leave order at back door',
        id_location: 'location-1',
        created_at: noteCreatedAt,
      },
    ];

    const result = mapper.toDomainObject(
      locationModel,
      locationTypeModel,
      locationNotesModel,
    );

    expect(result).toBeInstanceOf(LocationEntity);
    expect(result).toEqual(
      new LocationEntity(
        'location-1',
        'Main St',
        '123',
        'Downtown',
        '64000',
        'Store A',
        '25.68',
        '-100.31',
        CLIENT_STATUS_ENUM.CLIENT,
        'creator-1',
        'client-1',
        locationCreatedAt,
        locationUpdatedAt,
        new LocationTypeObjectValue('type-1', 'Grocery', locationTypeCreatedAt),
        [
          new NoteObjectValue(
            'note-1',
            'Leave order at back door',
            'location-1',
            noteCreatedAt,
          ),
        ],
        'Near the park',
      ),
    );
  });
});

```