// Libraries
import { Injectable, Inject } from '@nestjs/common'; 

// Interfaces
import { LocationRepository } from '@/src/clients/core/interfaces/location.repository';

// Shared interfaces
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

// Aggregates
import { ClientAggregate } from '@/src/clients/core/aggregates/client.aggregate';

// Entity
import { LocationEntity } from '@/src/clients/core/entities/location.entity';

// Object values
import { LocationTypeObjectValue } from '@/src/clients/core/object-values/location-type.object-value';

@Injectable()
export class CreateLocationTypeCommand {
  constructor(
    @Inject(LocationRepository) private readonly locationRepository: LocationRepository,
    @Inject(IntegrityRepository) private readonly integrityRepository: IntegrityRepository,
  ) { }

  async execute(
    _street: string,
    _ext_number: string,
    _colony: string,
    _postal_code: string,
    _location_name: string,
    _latitude: string,
    _longitude: string,
    _status_location: number,
    _id_creator: string,
    _id_location_type: string,
    _created_at: Date,
    _updated_at: Date,
    _id_location?: string,
    _id_client?: string,
    _address_reference?: string,
  ): Promise<void> {
    const newLocation:LocationEntity[] = [];
    
    const locationType: LocationTypeObjectValue[] = await this.locationRepository.retrieveLocationTypeById([_id_location_type]);

    if (locationType.length === 0) {
      throw new Error(`Location type with id ${_id_location_type} does not exist.`);
    }

    const clientAggregate: ClientAggregate = new ClientAggregate(null, [], []);

    newLocation.push(
      clientAggregate.createLocation(
        _id_location ?? this.integrityRepository.generateUUIDv4(),
        _street,
        _ext_number,
        _colony,
        _postal_code,
        _location_name,
        _latitude,
        _longitude,
        _id_creator,
        locationType.pop()!,
        _created_at,
        _updated_at,
        _id_client,
        _address_reference,
      )
    );

    await this.locationRepository.createLocation(newLocation.pop()!);
  }
}
