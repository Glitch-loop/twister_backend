// Libraries
import { Body, Controller, Post, Get, Patch, Param, Query } from '@nestjs/common';

// DTOs
import type { ClientDto } from '@/src/clients/application/dtos/client.dto';
import type { LocationDto } from '@/src/clients/application/dtos/location.dto';
import type { LocationTypeDto } from '@/src/clients/application/dtos/location_type.dto';
import type { FurnitureDto } from '@/src/clients/application/dtos/furniture.dto';
import type { LocationNoteDto } from '@/src/clients/application/dtos/location_note.dto';

// Commands
import { CreateClientCommand } from '@/src/clients/application/commands/create-client.command';
import { ModifyClientCommand } from '@/src/clients/application/commands/modify-client.command';
import { DeactivateClientCommand } from '@/src/clients/application/commands/deactivate-client.command';
import { CreateLocationCommand } from '@/src/clients/application/commands/create-location.command';
import { ModifyLocationCommand } from '@/src/clients/application/commands/modify-location.command';
import { DeactivateLocationCommand } from '@/src/clients/application/commands/deactivate-location.command';
import { CreationNoteCommand } from '@/src/clients/application/commands/creation-note.command';
import { CreateLocationTypeCommand } from '@/src/clients/application/commands/create-location-type.command';
import { CreateFurnitureCommand } from '@/src/clients/application/commands/create-furniture.command';
import { ModifyFurnitureCommand } from '@/src/clients/application/commands/modify-furniture.command';

// Queries
import { ListLocationTypesQuery } from '@/src/clients/application/queries/list-location-types.query';
import { ListLocationsQuery } from '@/src/clients/application/queries/list-locations.query';
import { RetrieveClientsByIdQuery } from '@/src/clients/application/queries/retrieve-clients-by-id.query';
import { RetrieveLocationsByIdLocationQuery } from '@/src/clients/application/queries/retrieve-locations-by-id-location.query';
import { ListClientsQuery } from '@/src/clients/application/queries/list-clients.query';

// Presentation
import { httpControllerResponse } from '@/src/shared/presentation/http/interfaces/controller-response.interface';
import { httpFormatter } from '@/src/shared/presentation/http/handlers/http-formatter.handler';

@Controller('clients')
export class ClientsController {
  constructor(
    // Commands
    private readonly createClientCommand: CreateClientCommand,
    private readonly modifyClientCommand: ModifyClientCommand,
    private readonly deactivateClientCommand: DeactivateClientCommand,
    private readonly createLocationCommand: CreateLocationCommand,
    private readonly modifyLocationCommand: ModifyLocationCommand,
    private readonly deactivateLocationCommand: DeactivateLocationCommand,
    private readonly creationNoteCommand: CreationNoteCommand,
    private readonly createLocationTypeCommand: CreateLocationTypeCommand,
    private readonly createFurnitureCommand: CreateFurnitureCommand,
    private readonly modifyFurnitureCommand: ModifyFurnitureCommand,

    // Query
    private readonly listLocationTypesQuery: ListLocationTypesQuery,
    private readonly listLocationsQuery: ListLocationsQuery,
    private readonly listClientsQuery: ListClientsQuery,
    private readonly retrieveClientsByIdQuery: RetrieveClientsByIdQuery,
    private readonly retrieveLocationsByIdLocationQuery: RetrieveLocationsByIdLocationQuery,
  ) {}

  @Post('')
  async createClient(@Body() body: Partial<ClientDto>): Promise<httpControllerResponse> {
    await this.createClientCommand.execute(
      body.legal_name!,
      body.postal_code!,
      body.fiscal_regime!,
      body.name!,
      body.cellphone!,
      body.email!,
      body.id_client,
    );
    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Client created successfully');
  }

  @Get('')
  async listClients(
    @Query('limit') limit?: string,
    @Query('cellphone') cellphone?: string,
    @Query('email') email?: string,
    @Query('legal_name') legal_name?: string,
    @Query('name') name?: string,
    @Query('next_item') next_item?: string,
  ): Promise<httpControllerResponse> {
    let next_id: string|undefined = undefined;
    let next_date: string|undefined = undefined
    let parsedLimit: number|undefined = undefined;

    const httpRequestFormatter = new httpFormatter();
    const httpResponseFormatter = new httpFormatter();
    if(next_item) {
      const paginationInformation = httpRequestFormatter.decodingNextItemForPagination(next_item);
      next_id = paginationInformation.id;
      if(paginationInformation.created_at) next_date = paginationInformation.created_at;
    }
    
    if (limit) parsedLimit = parseInt(limit, 10);
    
    const data: ClientDto[] = await this.listClientsQuery.execute(
      parsedLimit, 
      cellphone, 
      email, 
      legal_name, 
      name, 
      next_id, 
      next_date);
    
    return httpResponseFormatter.createResponse('Client listed successfully.', data, parsedLimit, 'id_client', 'created_at');
  }

  @Post('/ids')
  async retrieveClientsById(@Body() body: { id_clients: string[] }): Promise<httpControllerResponse> {
    const { id_clients } = body;
    const data: ClientDto[] = await this.retrieveClientsByIdQuery.execute(id_clients ?? []);

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Clients retrieved successfully.', data);
  }

  @Patch('/:id_client')
  async modifyClient(
    @Param('id_client') id_client: string,
    @Body() body: Partial<ClientDto>,
  ): Promise<httpControllerResponse> {
    await this.modifyClientCommand.execute(
      id_client,
      body.legal_name,
      body.postal_code,
      body.fiscal_regime,
      body.name,
      body.cellphone,
      body.email,
    );

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Client modified successfully');
  }

  @Patch('/:id_client/deactivate')
  async deactivateClient(@Param('id_client') id_client: string): Promise<httpControllerResponse> {
    await this.deactivateClientCommand.execute(id_client);

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Client deactivated successfully');
  }

  @Post('/locations')
  async createLocation(@Body() body: Partial<LocationDto>): Promise<httpControllerResponse> {
    await this.createLocationCommand.execute(
      body.street!,
      body.ext_number!,
      body.colony!,
      body.postal_code!,
      body.location_name!,
      body.latitude!,
      body.longitude!,
      body.status_location!,
      body.id_creator!,
      body.id_location_type!,
      body.created_at!,
      body.updated_at!,
      body.id_location,
      body.id_client,
      body.address_reference,
    );

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Location created successfully');
  }

  @Get('/locations')
  async listLocations(
    @Query('limit') limit?: string,
    @Query('next_item') next_item?: string,
    @Query('ext_number') ext_number?: string,
    @Query('colony') colony?: string,
    @Query('postal_code') postal_code?: string,
    @Query('location_name') location_name?: string,
    @Query('status_location') status_location?: string | string[],
    @Query('id_creator') id_creator?: string | string[],
    @Query('id_client') id_client?: string | string[],
    @Query('id_location_type') id_location_type?: string | string[],
  ): Promise<httpControllerResponse> {
    let next_id: string | undefined = undefined;
    let next_date: string | undefined = undefined;
    let parsedLimit: number | undefined = undefined;

    const toArray = (value?: string | string[]): string[] | undefined => {
      if (!value) return undefined;
      if (Array.isArray(value)) return value.filter((item) => item.length > 0);

      return value
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    };

    const statusLocationValues = toArray(status_location);
    const statusLocationParsed = statusLocationValues?.map((value) => Number.parseInt(value, 10))
      .filter((value) => Number.isInteger(value));

    const idCreatorValues = toArray(id_creator);
    const idClientValues = toArray(id_client);
    const idLocationTypeValues = toArray(id_location_type);

    const httpRequestFormatter = new httpFormatter();
    const httpResponseFormatter = new httpFormatter();

    if (next_item) {
      const paginationInformation = httpRequestFormatter.decodingNextItemForPagination(next_item);
      next_id = paginationInformation.id;
      if (paginationInformation.created_at) next_date = paginationInformation.created_at;
    }

    if (limit) parsedLimit = Number.parseInt(limit, 10);

    const data: LocationDto[] = await this.listLocationsQuery.execute(
      parsedLimit,
      next_date,
      next_id,
      ext_number,
      colony,
      postal_code,
      location_name,
      statusLocationParsed,
      idCreatorValues,
      idClientValues,
      idLocationTypeValues,
    );

    return httpResponseFormatter.createResponse(
      'Locations listed successfully.',
      data,
      parsedLimit,
      'id_location',
      'created_at',
    );

  }

  @Post('/locations/ids') 
  async retrieveLocationById(@Body() body: { id_locations: string[] }): Promise<httpControllerResponse> {
    const { id_locations } = body;
    const data: LocationDto[] = await this.retrieveLocationsByIdLocationQuery.execute(id_locations ?? []);

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Locations retrieved successfully.', data);
  }

  @Patch('/locations/:id_location')
  async modifyLocation(
    @Param('id_location') id_location: string,
    @Body() body: Partial<LocationDto>,
  ): Promise<httpControllerResponse> {
    await this.modifyLocationCommand.execute(
      id_location,
      body.street,
      body.ext_number,
      body.colony,
      body.postal_code,
      body.location_name,
      body.latitude,
      body.longitude,
      body.status_location,
      body.id_creator,
      body.id_client,
      body.id_location_type,
      body.address_reference ?? null,
    );

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Location modified successfully');
  }

  @Patch('/locations/:id_location/deactivate/:deactivation_type')
  async deactivateLocation(
    @Param('id_location') id_location: string,
    @Param('deactivation_type') deactivation_type: string,
  ): Promise<httpControllerResponse> {
    await this.deactivateLocationCommand.execute(id_location, parseInt(deactivation_type, 10));

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Location deactivated successfully');
  }

  @Post('/locations/:id_location/notes')
  async createLocationNote(
    @Param('id_location') id_location: string,
    @Body() body: Partial<LocationNoteDto>,
  ): Promise<httpControllerResponse> {
    await this.creationNoteCommand.execute(
      id_location,
      body.note!,
      body.created_at,
    );

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Location note created successfully');
  }

  @Get('/locations/types')
  async listLocationTypes(
    @Query('limit') limit?: string,
    @Query('next_item') next_item?: string,
  ): Promise<httpControllerResponse> {
    let next_id: string | undefined = undefined;
    let next_date: string | undefined = undefined;
    let parsedLimit: number | undefined = undefined;

    const httpRequestFormatter = new httpFormatter();

    if (next_item) {
      const paginationInformation = httpRequestFormatter.decodingNextItemForPagination(next_item);
      next_id = paginationInformation.id;
      if (paginationInformation.created_at) next_date = paginationInformation.created_at;
    }

    if (limit) parsedLimit = Number.parseInt(limit, 10);

    const locationTypes = await this.listLocationTypesQuery.execute(
      parsedLimit,
      next_date,
      next_id,
    );

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse(
      'Location types retrieved successfully',
      locationTypes,
      parsedLimit,
      'id_location_type',
      'created_at',
    );
  }

  @Post('/locations/types')
  async createLocationType(@Body() body: Partial<LocationTypeDto>): Promise<httpControllerResponse> {
    await this.createLocationTypeCommand.execute(body.location_type_name!);

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Location type created successfully');
  }

  @Post('/locations/furnitures')
  async createFurniture(@Body() body: Partial<FurnitureDto>): Promise<httpControllerResponse> {
    await this.createFurnitureCommand.execute(
      body.delivered_date!,
      body.description_furniture!,
      body.id_location!,
    );

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Furniture created successfully');
  }

  @Patch('/locations/furnitures/:id_furniture')
  async modifyFurniture(
    @Param('id_furniture') id_furniture: string,
    @Body() body: Partial<FurnitureDto>,
  ): Promise<httpControllerResponse> {
    await this.modifyFurnitureCommand.execute(
      id_furniture,
      body.delivered_date,
      body.description_furniture,
      body.id_location,
    );

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Furniture modified successfully');
  }
}