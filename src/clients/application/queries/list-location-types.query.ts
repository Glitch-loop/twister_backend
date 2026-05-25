// Libraries
import { Inject, Injectable } from '@nestjs/common';

// Interface
import { LocationRepository } from '@/src/clients/core/interfaces/location.repository';

// DTOs
import { LocationTypeDto } from '@/src/clients/application/dtos/location-type.dto';

// Object values
import { LocationTypeObjectValue } from '@/src/clients/core/object-values/location-type.object-value'

// Mapper
import { Mapper } from '@/src/clients/application/mappers/entity-dto.mapper';


@Injectable()
export class ListLocationTypesQuery {
  constructor(
      @Inject(LocationRepository) private readonly locationRepository: LocationRepository,
      private readonly mapper: Mapper,
  ) {}

  async execute(
    limit?: number,
    nextCreatedAt?: string,
    nextId?: string,
  ): Promise<LocationTypeDto[]> {
    let limitToUse = 1001;

    if ((nextCreatedAt && !nextId) || (!nextCreatedAt && nextId)) {
      throw new Error('If consulting a page larger than 1, pagination metadata is required.');
    }

    if (typeof limit === 'number' && limit > 0 && limit <= 1000) {
      limitToUse = limit + 1;
    }

    const locationTypes: LocationTypeObjectValue[] = await this.locationRepository.listLocationTypes(
      limitToUse,
      nextCreatedAt,
      nextId,
    );
    return locationTypes.map((locationType: LocationTypeObjectValue) => this.mapper.toDto(locationType));
  } 
}