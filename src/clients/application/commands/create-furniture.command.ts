// Libraries
import { Injectable, Inject } from '@nestjs/common'; 

// Interfaces
import { LocationRepository } from '@/src/clients/core/interfaces/location.repository';

// Shared interfaces
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

// Aggregates
import { ClientAggregate } from '@/src/clients/core/aggregates/client.aggregate';


// Entity
import { FurnitureEntity } from '@/src/clients/core/entities/furniture.entity';
import { LocationEntity } from '@/src/clients/core/entities/location.entity';

@Injectable()
export class CreateFurnitureCommand {
  constructor(
    @Inject(LocationRepository) private readonly locationRepository: LocationRepository,
    @Inject(IntegrityRepository) private readonly integrityRepository: IntegrityRepository,
  ) { }

  async execute(
    _delivered_date: Date, 
    _description_furniture: string, 
    _id_location: string
  ): Promise<void> {
    const newFurnitures:FurnitureEntity[] = [];
    const locations: LocationEntity[] = await this.locationRepository.retrieveLocationById([ _id_location ]);
    
    if (!locations || locations.length === 0) {
      throw new Error(`Location with id ${_id_location} not found`);
    }
    
    const clientAggregate: ClientAggregate = new ClientAggregate(null, locations, []);

    newFurnitures.push(
      clientAggregate.addFurniture(
        this.integrityRepository.generateUUIDv4(),
        _delivered_date,
        _description_furniture,
        _id_location,
      )
    );

    await this.locationRepository.addFurnitures(newFurnitures);
  }
}
