// Libraries
import { Inject, Injectable } from '@nestjs/common';

// Interface
import { LocationRepository } from '@/src/clients/core/interfaces/location.repository';

// DTOs
import { LocationTypeDto } from '../dtos/location_type.dto';

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

  async execute(): Promise<LocationTypeDto[]> {   
    const locationTypes: LocationTypeObjectValue[] = await this.locationRepository.listLocationTypes();
    return locationTypes.map((locationType: LocationTypeObjectValue) => this.mapper.toDto(locationType));
  } 
}