// Libraries
import { Injectable } from '@nestjs/common';

// Repositories
import { LocationRepository } from '@/src/clients/core/interfaces/location.repository';

// Entities
import { LocationEntity } from '@/src/clients/core/entities/location.entity';
import { FurnitureEntity } from '@/src/clients/core/entities/furniture.entity';

// Object values
import { NoteObjectValue } from '@/src/core/object-values/note.object-value';
import { LocationTypeObjectValue } from '@/src/clients/core/object-values/location-type.object-value';

// Models
import { LocationModel } from '@/src/clients/application/models/location.model';
import { LocationNoteModel } from '@/src/clients/application/models/location-note.model';
import { LocationTypeModel } from '@/src/clients/application/models/location-type.model';
import { FurnitureModel } from '@/src/clients/application/models/furniture.model';

// Datasource
import { SupabaseDataSource } from '@/src/infrastructure/datasources/supabase-data-source';

// Mappers
import { Mapper } from '@/src/clients/application/mappers/entity-model.mapper';

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
  ): Promise<LocationEntity[]> {
    const { data, error } = await this.supabase
      .from('locations')
      .select()
      .in('id_location', id_location);

    if (error) {
      throw new Error('Failed to retrieve location by ID');
    }

    if (!data || data.length === 0) {
      return [];
    }

    return Promise.all(
      (data as LocationModel[]).map((locationModel) =>
        this.composeLocationEntity(locationModel),
      ),
    );
  }

  async retrieveLocationByClient(
    id_client: string,
  ): Promise<LocationEntity[]> {
    const { data, error } = await this.supabase
      .from('locations')
      .select()
      .eq('id_client', id_client);

    if (error) {
      throw new Error('Failed to retrieve location by client');
    }

    if (!data || data.length === 0) {
      return [];
    }

    return Promise.all(
      (data as LocationModel[]).map((locationModel) =>
        this.composeLocationEntity(locationModel),
      ),
    );
  }

  async retrieveLocationsByCreator(
    id_creator: string,
  ): Promise<LocationEntity[]> {
    const { data, error } = await this.supabase
      .from('locations')
      .select()
      .eq('id_creator', id_creator);

    if (error) {
      throw new Error('Failed to retrieve location by creator');
    }

    if (!data || data.length === 0) {
      return [];
    }

    return Promise.all(
      (data as LocationModel[]).map((locationModel) =>
        this.composeLocationEntity(locationModel),
      ),
    );
  }

  async retrieveFurnitureById(id_furniture: string[]): Promise<FurnitureEntity[]> {
    const { data, error } = await this.supabase
      .from('furnitures')
      .select()
      .in('id_furniture', id_furniture);

    if (error) {
      throw new Error('Failed to retrieve furniture by ID');
    }

    if (!data || data.length === 0) {
      return [];
    }

    return (data as FurnitureModel[]).map((furniture) =>
      this.mapper.toDomainObject(furniture),
    );
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

  async updateFurniture(
    id_furniture: string,
    updatedData: Partial<FurnitureEntity>,
  ): Promise<void> {
    const payload: Partial<FurnitureModel> = {
      ...(updatedData.delivered_date !== undefined && {
        delivered_date: updatedData.delivered_date,
      }),
      ...(updatedData.description_furniture !== undefined && {
        description_furniture: updatedData.description_furniture,
      }),
      ...(updatedData.id_location !== undefined && {
        id_location: updatedData.id_location,
      }),
    };

    const { error } = await this.supabase
      .from('furnitures')
      .update(payload)
      .eq('id_furniture', id_furniture);

    if (error) {
      throw new Error('Failed to update furniture');
    }
  }

  async listLocations(
    limit: number,
    nextCreatedAt?: string, 
    nextId?: string,
    ext_number?: string,
    colony?: string,
    postal_code?: string,
    location_name?: string,
    status_location?: number[],
    id_creator?: string[],
    id_client?: string[],
    id_location_type?: string[]
  ): Promise<LocationEntity[]> {
    const query = this.supabase.from('locations').select();

    if (ext_number) query.ilike('ext_number', `%${ext_number}%`);
    if (colony) query.ilike('colony', `%${colony}%`);
    if (postal_code) query.ilike('postal_code', `%${postal_code}%`);
    if (location_name) query.ilike('location_name', `%${location_name}%`);

    if (status_location) 
      if(status_location.length > 0) query.in('id_creator', status_location);
    

    if (id_creator)
      if(id_creator.length > 0) query.in('id_creator', id_creator);
    

    if (id_client) 
      if(id_client.length > 0) query.in('id_client', id_client);
    

    if (id_location_type)
      if(id_location_type.length > 0) query.in('id_location_type', id_location_type);
    
    if (nextCreatedAt && nextId) {
      // Keyset pagination for DESC order: older rows, then UUID tie-breaker.
      query.or(
        `created_at.lt."${nextCreatedAt}",and(created_at.eq."${nextCreatedAt}",id_location.lt."${nextId}")`,
      );
    }

    query.limit(limit);
    

    const { data, error } = await query;

    if (error) {
      throw new Error('Failed to list locations');
    }

    const locationModels = data as LocationModel[];
    const locationEntities = await Promise.all(
      locationModels.map((locationModel) => this.composeLocationEntity(locationModel)),
    );

    return locationEntities;
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

  async listLocationTypes(
    limit?: number,
    nextCreatedAt?: string,
    nextId?: string,
  ): Promise<LocationTypeObjectValue[]> {
    try {
      const query = this.supabase.from('location_types').select();

      if (nextCreatedAt && nextId) {
        query.or(
          `created_at.lt."${nextCreatedAt}",and(created_at.eq."${nextCreatedAt}",id_location_type.lt."${nextId}")`,
        );
      }

      query.order('created_at', { ascending: false });
      query.order('id_location_type', { ascending: false });

      if (typeof limit === 'number' && limit > 0) {
        query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error('Failed to list location types' + (error instanceof Error ? `: ${error.message}` : ''));
      }

      return ((data ?? []) as LocationTypeModel[]).map((locationType) => this.mapper.toDomainObject(locationType));
    } catch (error) {
      throw new Error('Failed to list location types' + (error instanceof Error ? `: ${error.message}` : ''));
    }
  }

  async retrieveLocationTypeById(id_location_type: string[]): Promise<LocationTypeModel[]> {    
    try {
      const { data, error } = await this.supabase
        .from('location_types')
        .select()
        .eq('id_location_type', id_location_type);
  
      if (error) {
        throw new Error('Failed to retrieve location type by ID');
      }
  
      return ((data ?? []) as LocationTypeModel[]).map((locationType) => this.mapper.toDomainObject(locationType));

    } catch (error) {
      throw new Error('Failed to retrieve location type by ID' + (error instanceof Error ? `: ${error.message}` : ''));
    }
  }


  async createLocationType(locationType: LocationTypeObjectValue): Promise<void> {
    const locationTypeModel = this.mapper.toModel(locationType);
    try {
      const { error } = await this.supabase.from('location_types').insert(locationTypeModel);

      if (error) {
        throw new Error('Failed to create location type' + (error instanceof Error ? `: ${error.message}` : ''));
      }
    } catch (error) {
      throw new Error('Failed to create location type' + (error instanceof Error ? `: ${error.message}` : ''));
    }
  }

  async addFurnitures(furnitures: FurnitureEntity[]): Promise<void> {
    
    try {
      const furnitureModels: FurnitureModel[] = furnitures.map((furniture) => this.mapper.toModel(furniture));
  
      const { error } = await this.supabase.from('furnitures').insert(furnitureModels);
  
      if (error) {
        throw new Error('Failed to add furnitures to location' + (error instanceof Error ? `: ${error.message}` : ''));
      }
    } catch (error) {
      throw new Error('Failed to add furnitures to location' + (error instanceof Error ? `: ${error.message}` : ''));
    }
  }

  private async composeLocationEntity(
    locationModel: LocationModel,
  ): Promise<LocationEntity> {
    const [locationTypeModel, locationNotesModel] = await Promise.all([
      this.retrieveLocationTypeById([locationModel.id_location_type]),
      this.retrieveLocationNotesByLocationId(locationModel.id_location),
    ]);

    if (locationTypeModel.length === 0) {
      throw new Error(
        `Location type with id ${locationModel.id_location_type} does not exist.`,
      );
    }

    return this.mapper.toDomainObject(
      locationModel,
      locationTypeModel[0],
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