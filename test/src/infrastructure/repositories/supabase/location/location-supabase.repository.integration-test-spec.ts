import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { randomUUID } from 'crypto';
import { LocationSupabaseRepository } from '@/src/clients/infrastructure/repositories/supabase/location-supabase.repository';
import { SupabaseDataSource } from '@/src/infrastructure/datasources/supabase-data-source';
import { Mapper } from '@/src/application/mappers/entity-model.mapper';
import { LocationEntity } from '@/src/clients/core/entities/location.entity';
import { LocationTypeObjectValue } from '@/src/core/object-values/location-type.object-value';
import { NoteObjectValue } from '@/src/core/object-values/note.object-value';
import { CLIENT_STATUS_ENUM } from '@/src/clients/core/enums/client-status.enum';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildTestLocationType(
  overrides: Partial<LocationTypeObjectValue> = {},
): LocationTypeObjectValue {
  return new LocationTypeObjectValue(
    overrides.id_location_type ?? randomUUID(),
    overrides.location_type_name ?? 'Test Location Type',
    overrides.created_at ?? new Date('2024-01-01T00:00:00.000Z'),
  );
}

function buildTestLocation(
  locationType: LocationTypeObjectValue,
  overrides: Partial<LocationEntity> = {},
): LocationEntity {
  return new LocationEntity(
    overrides.id_location ?? randomUUID(),
    overrides.street ?? 'Av. Integración',
    overrides.ext_number ?? '42',
    overrides.colony ?? 'Col. Test',
    overrides.postal_code ?? '64000',
    overrides.location_name ?? 'Test Location',
    overrides.latitude ?? '25.6866',
    overrides.longitude ?? '-100.3161',
    overrides.status_location ?? CLIENT_STATUS_ENUM.CLIENT,
    overrides.id_creator ?? randomUUID(),
    overrides.id_client ?? randomUUID(),
    overrides.created_at ?? new Date('2024-01-01T00:00:00.000Z'),
    overrides.updated_at ?? new Date('2024-01-01T00:00:00.000Z'),
    locationType,
    overrides.notes ?? [],
    overrides.address_reference ?? null,
  );
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('LocationSupabaseRepository – integration tests', () => {
  let repository: LocationSupabaseRepository;
  let dataSource: SupabaseDataSource;
  let sharedLocationType: LocationTypeObjectValue;
  const createdLocationIds: string[] = [];

  beforeAll(async () => {
    if (
      !process.env.PUBLIC_SUPABASE_URL ||
      !process.env.PUBLIC_SUPABASE_ANON_KEY
    ) {
      throw new Error(
        'Integration tests require PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY environment variables.',
      );
    }

    dataSource = new SupabaseDataSource();
    const mapper = new Mapper();
    repository = new LocationSupabaseRepository(dataSource, mapper);

    // Insert a shared location_type required by every location record
    sharedLocationType = buildTestLocationType();
    const { error } = await dataSource
      .getClient()
      .from('location_types')
      .insert({
        id_location_type: sharedLocationType.id_location_type,
        location_type_name: sharedLocationType.location_type_name,
        created_at: sharedLocationType.created_at.toISOString(),
      });

    if (error) {
      throw new Error(
        `Failed to seed location_type for integration tests: ${error.message}`,
      );
    }
  });

  afterAll(async () => {
    const supabase = dataSource.getClient();

    // Remove all location_notes and locations created during the suite
    if (createdLocationIds.length > 0) {
      await supabase
        .from('location_notes')
        .delete()
        .in('id_location', createdLocationIds);
      await supabase
        .from('locations')
        .delete()
        .in('id_location', createdLocationIds);
    }

    // Remove the shared location_type
    await supabase
      .from('location_types')
      .delete()
      .eq('id_location_type', sharedLocationType.id_location_type);
  });

  // -------------------------------------------------------------------------
  describe('createLocation', () => {
    it('should insert a location without notes without throwing', async () => {
      const location = buildTestLocation(sharedLocationType);
      createdLocationIds.push(location.id_location);

      await expect(
        repository.createLocation(location),
      ).resolves.toBeUndefined();
    });

    it('should insert a location with notes', async () => {
      const note = new NoteObjectValue(
        randomUUID(),
        'Integration test note',
        '',
        new Date('2024-01-01T00:00:00.000Z'),
      );
      const location = buildTestLocation(sharedLocationType, { notes: [note] });
      createdLocationIds.push(location.id_location);

      await expect(
        repository.createLocation(location),
      ).resolves.toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  describe('retrieveLocationById', () => {
    it('should return the location that was previously created', async () => {
      const location = buildTestLocation(sharedLocationType);
      createdLocationIds.push(location.id_location);
      await repository.createLocation(location);

      const result = await repository.retrieveLocationById([
        location.id_location,
      ]);

      expect(result).not.toBeNull();
      expect(result!.id_location).toBe(location.id_location);
      expect(result!.location_name).toBe(location.location_name);
      expect(result!.location_type.id_location_type).toBe(
        sharedLocationType.id_location_type,
      );
    });

    it('should return null when no location matches', async () => {
      const result = await repository.retrieveLocationById([randomUUID()]);
      expect(result).toBeNull();
    });
  });

  // -------------------------------------------------------------------------
  describe('retrieveLocationByClient', () => {
    it('should return the location associated with the given client', async () => {
      const clientId = randomUUID();
      const location = buildTestLocation(sharedLocationType, {
        id_client: clientId,
      });
      createdLocationIds.push(location.id_location);
      await repository.createLocation(location);

      const result = await repository.retrieveLocationByClient(clientId);

      expect(result).not.toBeNull();
      expect(result!.id_client).toBe(clientId);
    });

    it('should return null for a client with no locations', async () => {
      const result = await repository.retrieveLocationByClient(randomUUID());
      expect(result).toBeNull();
    });
  });

  // -------------------------------------------------------------------------
  describe('updateLocation', () => {
    it('should update the specified fields of an existing location', async () => {
      const location = buildTestLocation(sharedLocationType);
      createdLocationIds.push(location.id_location);
      await repository.createLocation(location);

      await repository.updateLocation(location.id_location, {
        location_name: 'Updated Location Name',
        street: 'Calle Actualizada',
      });

      const updated = await repository.retrieveLocationById([
        location.id_location,
      ]);
      expect(updated!.location_name).toBe('Updated Location Name');
      expect(updated!.street).toBe('Calle Actualizada');
      // Untouched fields should remain
      expect(updated!.colony).toBe(location.colony);
    });

    it('should upsert notes when notes are included in the update', async () => {
      const location = buildTestLocation(sharedLocationType);
      createdLocationIds.push(location.id_location);
      await repository.createLocation(location);

      const note = new NoteObjectValue(
        randomUUID(),
        'Upserted note',
        location.id_location,
        new Date('2024-06-01T00:00:00.000Z'),
      );
      await repository.updateLocation(location.id_location, { notes: [note] });

      const updated = await repository.retrieveLocationById([
        location.id_location,
      ]);
      expect(updated!.notes).toHaveLength(1);
      expect(updated!.notes[0].note).toBe('Upserted note');
    });
  });

  // -------------------------------------------------------------------------
  describe('deleteLocation', () => {
    it('should remove the location so it can no longer be retrieved', async () => {
      const location = buildTestLocation(sharedLocationType);
      // Do NOT push to createdLocationIds – we delete it ourselves
      await repository.createLocation(location);

      await repository.deleteLocation(location.id_location);

      const result = await repository.retrieveLocationById([
        location.id_location,
      ]);
      expect(result).toBeNull();
    });
  });

  // -------------------------------------------------------------------------
  describe('listLocations', () => {
    it('should include the newly created location in the returned list', async () => {
      const location = buildTestLocation(sharedLocationType);
      createdLocationIds.push(location.id_location);
      await repository.createLocation(location);

      const list = await repository.listLocations();

      const found = list.find((l) => l.id_location === location.id_location);
      expect(found).toBeDefined();
      expect(found!.location_name).toBe(location.location_name);
    });

    it('should return an array', async () => {
      const list = await repository.listLocations();
      expect(Array.isArray(list)).toBe(true);
    });
  });
});
