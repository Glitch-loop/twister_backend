import { beforeEach, describe, expect, it } from '@jest/globals';

import { Mapper } from '@/src/application/mappers/mapper';
import { CLIENT_STATUS_ENUM } from '@/src/core/enums/client-status.enum';
import { DayEntity } from '@/src/core/entities/day.entity';
import { UserEntity } from '@/src/core/entities/user.entity';
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

  it('maps UserModel to UserEntity', () => {
    const createdAt = new Date('2026-01-07T00:00:00.000Z');
    const updatedAt = new Date('2026-01-08T00:00:00.000Z');
    const userModel = {
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
    };

    const result = mapper.toDomainObject(userModel);

    expect(result).toBeInstanceOf(UserEntity);
    expect(result).toEqual(
      new UserEntity(
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
      ),
    );
  });
});
