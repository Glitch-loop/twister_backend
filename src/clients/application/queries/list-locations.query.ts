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

	async execute(
		limit?: number,
		nextCreatedAt?: string,
		nextId?: string,
		ext_number?: string,
		colony?: string,
		postal_code?: string,
		location_name?: string,
		status_location?: number[],
		id_creator?: string[],
		id_client?: string[],
		id_location_type?: string[],
	): Promise<LocationDto[]> {
		let limitToUse = 1001;

		if ((nextCreatedAt && !nextId) || (!nextCreatedAt && nextId)) {
			throw new Error('If consulting a page larger than 1, pagination metadata is required.');
		}

		if (typeof limit === 'number' && limit > 0 && limit <= 1000) {
			limitToUse = limit + 1;
		}

		const locations: LocationEntity[] = await this.locationRepository.listLocations(
			limitToUse,
			nextCreatedAt,
			nextId,
			ext_number,
			colony,
			postal_code,
			location_name,
			status_location,
			id_creator,
			id_client,
			id_location_type,
		);

		return locations.map((location: LocationEntity) => this.mapper.toDto(location));
	}
}
