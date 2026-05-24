// Entities
import { LocationEntity } from '@/src/clients/core/entities/location.entity';
import { FurnitureEntity } from '@/src/clients/core/entities/furniture.entity';

// Object values
import { LocationTypeObjectValue } from '@/src/clients/core/object-values/location-type.object-value'

export abstract class LocationRepository {
  abstract createLocation(location: LocationEntity): Promise<void>;
  abstract retrieveLocationById(id_location: string[]): Promise<LocationEntity[]>;
  abstract retrieveLocationByClient(id_client: string): Promise<LocationEntity[]>;
  abstract retrieveLocationsByCreator(id_creator: string): Promise<LocationEntity[]>;
  abstract retrieveFurnitureById(id_furniture: string[]): Promise<FurnitureEntity[]>;
  abstract updateLocation(id_location: string, updatedData: Partial<LocationEntity>): Promise<void>;
  abstract updateFurniture(id_furniture: string, updatedData: Partial<FurnitureEntity>): Promise<void>;
  abstract deleteLocation(id_location: string): Promise<void>;
  abstract listLocations(): Promise<LocationEntity[]>;
  abstract listLocationTypes(): Promise<LocationTypeObjectValue[]>;
  abstract createLocationType(locationType: LocationTypeObjectValue): Promise<void>;
  abstract retrieveLocationTypeById(id_location_type: string[]): Promise<LocationTypeObjectValue[]>;
  abstract addFurnitures(furnitures: FurnitureEntity[]): Promise<void>;
}
