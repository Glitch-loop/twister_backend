// Libraries
import { Injectable } from '@nestjs/common';

// Repositories
import { LocationRepository } from 'src/core/Interfaces/LocationRepository';

// Entities
import { LocationEntity } from 'src/core/entities/locationEntity';

// Object values
import { NoteObjectValue } from 'src/core/object-values/noteObjectValue';

// Datasource
import { SupabaseDataSource } from 'src/infrastructure/datasources/SupabaseDataSource';

@Injectable()
export class LocationSupabaseRepository implements LocationRepository {
  constructor(private readonly supabaseDataSource: SupabaseDataSource) {}

  private get supabase() {
    return this.supabaseDataSource.getClient();
  }

  async createLocation(location: LocationEntity[]): Promise<void> {
    try {
      const locationRecords = location.map((loc) => ({
        id_location: loc.id_location,
        street: loc.street,
        ext_number: loc.ext_number,
        colony: loc.colony,
        postal_code: loc.postal_code,
        address_reference: loc.address_reference,
        location_name: loc.location_name,
        latitude: loc.latitude,
        longitude: loc.longitude,
        status_location: loc.status_location,
        id_creator: loc.id_creator,
        id_client: loc.id_client,
        id_location_type: loc.location_type.id_location_type,
        created_at: loc.created_at,
        updated_at: loc.updated_at,
      }));

      const { error } = await this.supabase.from('locations').insert(locationRecords);
      
      if (error) {
        console.error('Error creating location:', error);
        throw new Error('Failed to create location');
      }
    
    } catch (error) {
      console.error('Error creating location:', error);
      throw new Error('Failed to create location');
    }
  };

  async retrieveLocationById(id_location: string[]): Promise<LocationEntity | null> { 
    try {
      const { error, data } = await this.supabase.from('locations').select().in('id_location', id_location);
      
      if (error) {
        throw new Error('Failed to retrieve location by ID');
      }
    
      if (data.length === 0) {
        return null;
      }


      

    } catch (error) {

      throw new Error('Failed to retrieve location by ID');
    }
  };
  async retrieveLocationByClient(id_client: string): Promise<LocationEntity | null> { ... };
  async updateLocation(id_location: string, updatedData: Partial<LocationEntity>): Promise<void> { ... };
  async deleteLocation(id_location: string): Promise<void> { ... };
  async listLocations(): Promise<LocationEntity[]> { ... };


  private async retrieveLocationNotesByLocationId(id_location: string): Promise<NoteObjectValue[]> { 
    try {
      const { data, error } = await this.supabase.from('location_notes').select().eq('id_location', id_location);
      
      if (error) {
        throw new Error('Failed to retrieve location notes by location ID');
      }

      return data.map((note: any) => {});
    } catch (error) {
      throw new Error('Failed to retrieve location notes by location ID');
    }
  };
}