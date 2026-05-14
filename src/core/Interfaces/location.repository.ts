import { LocationEntity } from '@/src/core/entities/location.entity';

export abstract class LocationRepository {
  abstract createLocation(location: LocationEntity): Promise<void>;
  abstract retrieveLocationById(id_location: string[]): Promise<LocationEntity | null>;
  abstract retrieveLocationByClient(id_client: string): Promise<LocationEntity | null>;
  abstract updateLocation(id_location: string, updatedData: Partial<LocationEntity>): Promise<void>;
  abstract deleteLocation(id_location: string): Promise<void>;
  abstract listLocations(): Promise<LocationEntity[]>;
}
