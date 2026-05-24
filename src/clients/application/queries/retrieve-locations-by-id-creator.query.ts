// Libraries
import { Inject, Injectable } from '@nestjs/common';

// Interface
import { LocationRepository } from '@/src/clients/core/interfaces/location.repository';

// Entities
import { LocationEntity } from '@/src/clients/core/entities/location.entity';

// DTOs
import { LocationDto } from '../dtos/location.dto';

// Mapper
import { Mapper } from '@/src/clients/application/mappers/entity-dto.mapper';

@Injectable()
export class RetrieveLocationsByIdCreatorQuery {
	constructor(
		@Inject(LocationRepository) private readonly locationRepository: LocationRepository,
		private readonly mapper: Mapper,
	) {}

	async execute(id_creator: string): Promise<LocationDto[]> {
		const allLocations: LocationEntity[] = await this.locationRepository.listLocations();
		const locations: LocationEntity[] = allLocations.filter(
			(location: LocationEntity) => location.id_creator === id_creator,
		);
		return locations.map((location: LocationEntity) => this.mapper.toDto(location));
	}
}
