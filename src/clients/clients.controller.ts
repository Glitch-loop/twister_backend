// Libraries
import { Body, Controller, Post, Get } from '@nestjs/common';

// DTOs
import type { UserDto } from '@/src/users/application/dtos/user.dto';

// Commands


// Queries
import { ListLocationTypesQuery } from '@/src/clients/application/queries/list-location-types.query';

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly listLocationTypesQuery: ListLocationTypesQuery,
    
  ) {}
  @Get('/locations/types')
  async findAll() {
    // Logic to retrieve all location types
    const locationTypes = await this.listLocationTypesQuery.execute();

    return { message: 'Location types retrieved successfully', data: locationTypes };
  }
}