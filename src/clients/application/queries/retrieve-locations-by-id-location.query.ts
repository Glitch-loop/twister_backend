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
export class RetrieveLocationsByIdLocationQuery {
	constructor(
		@Inject(LocationRepository) private readonly locationRepository: LocationRepository,
		private readonly mapper: Mapper,
	) {}

	async execute(id_client: string[]): Promise<LocationDto[]> {
		const maxIds = 1000;
		const ids = Array.isArray(id_client) ? id_client.slice(0, maxIds) : [id_client];

		if (ids.length === 0) {
			return [];
		}

		const uniqueIds = Array.from(new Set(ids));

		const locationsByClient: LocationEntity[] = await this.locationRepository.retrieveLocationById(uniqueIds)
		
		const locations: LocationEntity[] = locationsByClient.flat();
		return locations.map((location: LocationEntity) => this.mapper.toDto(location));
	}
}
