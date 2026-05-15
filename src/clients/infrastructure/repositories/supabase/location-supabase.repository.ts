// Libraries
import { Injectable } from '@nestjs/common';

// Repositories
import { LocationRepository } from '@/src/clients/core/interfaces/location.repository';

// Entities
import { LocationEntity } from '@/src/clients/core/entities/location.entity';

// Object values
import { NoteObjectValue } from '@/src/core/object-values/note.object-value';

// Datasource
import { SupabaseDataSource } from '@/src/infrastructure/datasources/supabase-data-source';
import { Mapper } from '@/src/application/mappers/entity-model.mapper';
import { LocationModel } from '@/src/application/models/location.model';
import { LocationNoteModel } from '@/src/application/models/location-note.model';
import { LocationTypeModel } from '@/src/application/models/location-type.model';

@Injectable()
export class LocationSupabaseRepository implements LocationRepository {
  constructor(
    private readonly supabaseDataSource: SupabaseDataSource,
    private readonly mapper: Mapper,
  ) {}

  private get supabase() {
    return this.supabaseDataSource.getClient();
  }

  async createLocation(location: LocationEntity): Promise<void> {
    const locationModel = this.mapper.toModel(location);
    const locationRecord = {
      ...locationModel,
      id_location_type: location.location_type.id_location_type,
    };

    const { error } = await this.supabase.from('locations').insert(locationRecord);

    if (error) {
      throw new Error('Failed to create location');
    }

    if (location.notes.length > 0) {
      await this.createLocationNotes(location.notes, location);
    }
  }

  async retrieveLocationById(
    id_location: string[],
  ): Promise<LocationEntity | null> {
    const { data, error } = await this.supabase
      .from('locations')
      .select()
      .in('id_location', id_location)
      .limit(1);

    if (error) {
      throw new Error('Failed to retrieve location by ID');
    }

    if (!data || data.length === 0) {
      return null;
    }

    return this.composeLocationEntity(data[0] as LocationModel);
  }

  async retrieveLocationByClient(
    id_client: string,
  ): Promise<LocationEntity | null> {
    const { data, error } = await this.supabase
      .from('locations')
      .select()
      .eq('id_client', id_client)
      .limit(1);

    if (error) {
      throw new Error('Failed to retrieve location by client');
    }

    if (!data || data.length === 0) {
      return null;
    }

    return this.composeLocationEntity(data[0] as LocationModel);
  }

  async updateLocation(
    id_location: string,
    updatedData: Partial<LocationEntity>,
  ): Promise<void> {
    const payload: Partial<LocationModel> & { id_location_type?: string } = {
      ...(updatedData.street !== undefined && { street: updatedData.street }),
      ...(updatedData.ext_number !== undefined && { ext_number: updatedData.ext_number }),
      ...(updatedData.colony !== undefined && { colony: updatedData.colony }),
      ...(updatedData.postal_code !== undefined && { postal_code: updatedData.postal_code }),
      ...(updatedData.location_name !== undefined && { location_name: updatedData.location_name }),
      ...(updatedData.latitude !== undefined && { latitude: updatedData.latitude }),
      ...(updatedData.longitude !== undefined && { longitude: updatedData.longitude }),
      ...(updatedData.status_location !== undefined && { status_location: updatedData.status_location }),
      ...(updatedData.id_creator !== undefined && { id_creator: updatedData.id_creator }),
      ...(updatedData.id_client !== undefined && { id_client: updatedData.id_client }),
      ...(updatedData.address_reference !== undefined && {
        address_reference: updatedData.address_reference ?? undefined,
      }),
      ...(updatedData.created_at !== undefined && { created_at: updatedData.created_at }),
      ...(updatedData.updated_at !== undefined && { updated_at: updatedData.updated_at }),
      ...(updatedData.location_type !== undefined && {
        id_location_type: updatedData.location_type.id_location_type,
      }),
    };

    const { error } = await this.supabase
      .from('locations')
      .update(payload)
      .eq('id_location', id_location);

    if (error) {
      throw new Error('Failed to update location');
    }

    if (updatedData.notes !== undefined) {
      await this.upsertLocationNotes(updatedData.notes, id_location);
    }
  }

  async deleteLocation(id_location: string): Promise<void> {
    await this.deleteLocationNotesByLocationId(id_location);

    const { error } = await this.supabase
      .from('locations')
      .delete()
      .eq('id_location', id_location);

    if (error) {
      throw new Error('Failed to delete location');
    }
  }

  async listLocations(): Promise<LocationEntity[]> {
    const { data, error } = await this.supabase.from('locations').select();

    if (error) {
      throw new Error('Failed to list locations');
    }

    const locationModels = data as LocationModel[];
    const locationEntities = await Promise.all(
      locationModels.map((locationModel) => this.composeLocationEntity(locationModel)),
    );

    return locationEntities;
  }

  private async composeLocationEntity(
    locationModel: LocationModel,
  ): Promise<LocationEntity> {
    const [locationTypeModel, locationNotesModel] = await Promise.all([
      this.retrieveLocationTypeById(locationModel.id_location_type),
      this.retrieveLocationNotesByLocationId(locationModel.id_location),
    ]);

    return this.mapper.toDomainObject(
      locationModel,
      locationTypeModel,
      locationNotesModel,
    );
  }

  private async createLocationNotes(
    notes: NoteObjectValue[],
    location: LocationEntity,
  ): Promise<void> {
    const locationNoteModels = notes.map(
      (note) => this.mapper.toModel(note, location) as unknown as LocationNoteModel,
    );

    const { error } = await this.supabase
      .from('location_notes')
      .insert(locationNoteModels);

    if (error) {
      throw new Error('Failed to create location notes');
    }
  }

  private async retrieveLocationTypeById(
    id_location_type: string,
  ): Promise<LocationTypeModel> {
    const response = await this.supabase
      .from('location_types')
      .select()
      .eq('id_location_type', id_location_type)
      .limit(1)
      .maybeSingle();

    if (response.error || !response.data) {
      throw new Error('Failed to retrieve location type by ID');
    }

    return response.data as LocationTypeModel;
  }

  private async retrieveLocationNotesByLocationId(
    id_location: string,
  ): Promise<LocationNoteModel[]> {
    const { data, error } = await this.supabase
      .from('location_notes')
      .select()
      .eq('id_location', id_location);

    if (error) {
      throw new Error('Failed to retrieve location notes by location ID');
    }

    return (data ?? []) as LocationNoteModel[];
  }

  private async upsertLocationNotes(
    notes: NoteObjectValue[],
    id_location: string,
  ): Promise<void> {
    const locationNoteModels = notes.map((note) => ({
      id_location_note: note.id_note,
      note: note.note,
      id_location,
      created_at: note.created_at,
    }));

    const { error } = await this.supabase
      .from('location_notes')
      .upsert(locationNoteModels, { onConflict: 'id_location_note' });

    if (error) {
      throw new Error('Failed to upsert location notes');
    }
  }

  private async deleteLocationNotesByLocationId(
    id_location: string,
  ): Promise<void> {
    const { error } = await this.supabase
      .from('location_notes')
      .delete()
      .eq('id_location', id_location);

    if (error) {
      throw new Error('Failed to delete location notes');
    }
  }
}