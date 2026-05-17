// Libraries
import { Injectable, Inject } from '@nestjs/common'; 

// Interfaces
import { LocationRepository } from '@/src/clients/core/interfaces/location.repository';

// Shared interfaces
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

// Aggregates
import { LocationTypeAggregate } from '@/src/clients/core/aggregates/location-type.aggregate';

// Entity
import { LocationTypeObjectValue } from '@/src/clients/core/object-values/location-type.object-value';

@Injectable()
export class CreateLocationTypeCommand {
  constructor(
    @Inject(LocationRepository) private readonly locationRepository: LocationRepository,
    @Inject(IntegrityRepository) private readonly integrityRepository: IntegrityRepository,
  ) { }

  async execute(
    _location_type_name: string,
  ): Promise<void> {
    const newLocationTypes: LocationTypeObjectValue[] = [];

    const locationsTypes: LocationTypeObjectValue[] = await this.locationRepository.listLocationTypes();
    
    const locationTypeAggregate: LocationTypeAggregate = new LocationTypeAggregate(locationsTypes);

    newLocationTypes.push(
      locationTypeAggregate.createLocationType(
        this.integrityRepository.generateUUIDv4(),
        _location_type_name,
      )
    );

    await this.locationRepository.createLocationType(newLocationTypes.pop()!);
  }
}
