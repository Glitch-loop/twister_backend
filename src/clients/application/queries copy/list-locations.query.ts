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
export class ListLocationsQuery {
	constructor(
		@Inject(LocationRepository) private readonly locationRepository: LocationRepository,
		private readonly mapper: Mapper,
	) {}

	async execute(): Promise<LocationDto[]> {
		const locations: LocationEntity[] = await this.locationRepository.listLocations();
		return locations.map((location: LocationEntity) => this.mapper.toDto(location));
	}
}
