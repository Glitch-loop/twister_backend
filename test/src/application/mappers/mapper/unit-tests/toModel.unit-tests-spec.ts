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
