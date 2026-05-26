// Libraries
import { Body, Controller, Post, Get, Patch, Param, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

// DTOs
import { LocationDto } from '@/src/clients/application/dtos/location.dto';
import type { FurnitureDto } from '@/src/clients/application/dtos/furniture.dto';
import { LocationNoteDto } from '@/src/clients/application/dtos/location-note.dto';
import { ClientDto } from '@/src/clients/application/dtos/client.dto';
import { LocationTypeRequestDto } from '@/src/clients/application/dtos/location-type-request.dto';
import { LocationTypeDto } from '@/src/clients/application/dtos/location-type.dto';
import { CreateLocationRequestDto } from '@/src/clients/application/dtos/create-location-request.dto';
import { ClientRequestDto } from '@/src/clients/application/dtos/client-request.dto';
import { UpdateLocationRequest } from '@/src/clients/application/dtos/update-location-request.dto';

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

@ApiTags('Clients')
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

  /**
   * Creates a new client record.
   * Input is received through request body and delegated to the create client command.
   * Returns a standardized controller response using the HTTP formatter.
   */
  @ApiOperation({
    summary: 'Create client',
    description: 'Creates a client and returns a standardized controller response.',
  })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
  @Post('')
  async createClient(@Body() body: ClientRequestDto): Promise<httpControllerResponse> {
    await this.createClientCommand.execute(
      body.legal_name,
      body.postal_code,
      body.fiscal_regime,
      body.name,
      body.cellphone,
      body.email,
      body.id_client,
    );
    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Client created successfully');
  }

  /**
   * Lists clients as a collection endpoint.
   * Supports filters, bounded limit, and cursor pagination via `next_item`.
   * Returns collection data plus pagination metadata through the HTTP formatter.
   */
  @ApiOperation({
    summary: 'List clients',
    description: 'Returns a paginated collection of clients with optional filters.',
  })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Page size (max 1000).' })
  @ApiQuery({ name: 'next_item', required: false, type: String, description: 'Opaque cursor for next page.' })
  @ApiQuery({ name: 'cellphone', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'legal_name', required: false, type: String })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiOkResponse({ description: 'Standardized paginated response with clients collection.', type: ClientDto })
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

  /**
   * Retrieves specific clients by identifier list.
   * This is a retrieve endpoint (not a list endpoint) and expects explicit IDs in body.
   * Returns a standardized response with the retrieved records.
   */
  @ApiOperation({
    summary: 'Retrieve clients by IDs',
    description: 'Retrieves specific client records from an explicit list of IDs.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id_clients: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
        },
      },
      required: ['id_clients'],
    },
  })
  @ApiOkResponse({ description: 'Standardized response with retrieved clients.', type: [ClientDto] })
  @Post('/ids')
  async retrieveClientsById(@Body() body: { id_clients: string[] }): Promise<httpControllerResponse> {
    const { id_clients } = body;
    const data: ClientDto[] = await this.retrieveClientsByIdQuery.execute(id_clients ?? []);

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Clients retrieved successfully.', data);
  }

  /**
   * Modifies one client identified by route param.
   * Partial update fields are accepted from body and delegated to the command layer.
   * Returns a standardized success response.
   */
  @ApiOperation({ summary: 'Modify client', description: 'Updates a client by ID.' })
  @ApiParam({ name: 'id_client', description: 'Client identifier', type: String })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
  @Patch('/:id_client')
  async modifyClient(
    @Param('id_client') id_client: string,
    @Body() body: ClientDto,
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

  /**
   * Deactivates one client identified by route param.
   * Delegates business behavior to the deactivate client command.
   * Returns a standardized success response.
   */
  @ApiOperation({ summary: 'Deactivate client', description: 'Deactivates a client by ID.' })
  @ApiParam({ name: 'id_client', description: 'Client identifier', type: String })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
  @Patch('/:id_client/deactivate')
  async deactivateClient(@Param('id_client') id_client: string): Promise<httpControllerResponse> {
    await this.deactivateClientCommand.execute(id_client);

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Client deactivated successfully');
  }

  /**
   * Creates a new location.
   * Input payload is mapped as command arguments and processed in the application layer.
   * Returns a standardized success response.
   */
  @ApiOperation({ summary: 'Create location', description: `Creates a location for a client context.
    Notes:
    - Client may provide an UUIDv4 for the new client otherwise the server will assign one.
    - A new client will be always created with the status of "Prospect".` })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
  @Post('/locations')
  async createLocation(@Body() body: CreateLocationRequestDto): Promise<httpControllerResponse> {
    await this.createLocationCommand.execute(
      body.street,
      body.ext_number,
      body.colony,
      body.postal_code,
      body.location_name,
      body.latitude,
      body.longitude,
      body.id_creator,
      body.id_location_type,
      body.created_at,
      body.updated_at,
      body.id_location,
      body.id_client,
      body.address_reference,
    );

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Location created successfully');
  }

  /**
   * Lists locations as a collection endpoint.
   * Supports filters, bounded limit, and cursor pagination (`next_item`).
   * Returns standardized collection response with pagination metadata.
   */
  @ApiOperation({
    summary: 'List locations',
    description: 'Returns a paginated collection of locations with optional filters.',
  })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Page size (max 1000).' })
  @ApiQuery({ name: 'next_item', required: false, type: String, description: 'Opaque cursor for next page.' })
  @ApiQuery({ name: 'ext_number', required: false, type: String })
  @ApiQuery({ name: 'colony', required: false, type: String })
  @ApiQuery({ name: 'postal_code', required: false, type: String })
  @ApiQuery({ name: 'location_name', required: false, type: String })
  @ApiQuery({
    name: 'status_location',
    required: false,
    type: String,
    isArray: true,
    description: 'Location status values. Accepts repeated query params or comma-separated values.',
  })
  @ApiQuery({
    name: 'id_creator',
    required: false,
    type: String,
    isArray: true,
    description: 'Creator IDs. Accepts repeated query params or comma-separated values.',
  })
  @ApiQuery({
    name: 'id_client',
    required: false,
    type: String,
    isArray: true,
    description: 'Client IDs. Accepts repeated query params or comma-separated values.',
  })
  @ApiQuery({
    name: 'id_location_type',
    required: false,
    type: String,
    isArray: true,
    description: 'Location type IDs. Accepts repeated query params or comma-separated values.',
  })
  @ApiOkResponse({ description: 'Standardized paginated response with locations collection.', type: [ClientDto] })
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

  /**
   * Retrieves specific locations by identifier list.
   * This endpoint is designed for explicit record retrieval by IDs.
   * Returns a standardized response with matching locations.
   */
  @ApiOperation({
    summary: 'Retrieve locations by IDs',
    description: 'Retrieves specific location records from an explicit list of IDs.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id_locations: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
        },
      },
      required: ['id_locations'],
    },
  })
  @ApiOkResponse({ description: 'Standardized response with retrieved locations.', type: [LocationDto] })
  @Post('/locations/ids') 
  async retrieveLocationById(@Body() body: { id_locations: string[] }): Promise<httpControllerResponse> {
    const { id_locations } = body;
    const data: LocationDto[] = await this.retrieveLocationsByIdLocationQuery.execute(id_locations ?? []);

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Locations retrieved successfully.', data);
  }

  /**
   * Modifies one location identified by route param.
   * Delegates update behavior to the location command.
   * Returns a standardized success response.
   */
  @ApiOperation({ summary: 'Modify location', description: 'Updates a location by ID.' })
  @ApiParam({ name: 'id_location', description: 'Location identifier', type: String })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
  @Patch('/locations/:id_location')
  async modifyLocation(
    @Param('id_location') id_location: string,
    @Body() body: UpdateLocationRequest,
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

  /**
   * Deactivates one location with a route-provided deactivation type.
   * Delegates business logic to the deactivate location command.
   * Returns a standardized success response.
   */
  @ApiOperation({ summary: 'Deactivate location', description: `Deactivates a location by ID and deactivation type.    
Deactivation reason/type:

- ***Closed*** - When a client ends their economical activity.

- ***Shutdown*** - When a client suddenly closes the business with the expectation of open in the future.

- ***Churned*** - When a client change to another supplied (preference).` })
  @ApiParam({ name: 'id_location', description: 'Location identifier', type: String })
  @ApiParam({ name: 'deactivation_type', description: 'Deactivation type identifier', type: String })
  @ApiOkResponse({ description: `Standardized response with operation message.` })
  @Patch('/locations/:id_location/deactivate/:deactivation_type')
  async deactivateLocation(
    @Param('id_location') id_location: string,
    @Param('deactivation_type') deactivation_type: string,
  ): Promise<httpControllerResponse> {
    await this.deactivateLocationCommand.execute(id_location, parseInt(deactivation_type, 10));

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Location deactivated successfully');
  }

  /**
   * Creates a note associated with a location.
   * Accepts note payload from body and delegates to command layer.
   * Returns a standardized success response.
   */
  @ApiOperation({ summary: 'Create location note', description: 'Creates a note for a location.' })
  @ApiParam({ name: 'id_location', description: 'Location identifier', type: String })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
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

  /**
   * Lists location types as a collection endpoint.
   * Supports bounded limit and cursor pagination.
   * Returns standardized collection response with pagination metadata.
   */
  @ApiOperation({
    summary: 'List location types',
    description: 'Returns a paginated collection of location types.',
  })
  @ApiQuery({ name: 'limit', required: false, type: String, description: 'Page size (max 1000).' })
  @ApiQuery({ name: 'next_item', required: false, type: String, description: 'Opaque cursor for next page.' })
  @ApiOkResponse({ description: 'Standardized paginated response with location types collection.', type: [LocationTypeDto] })
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

  /**
   * Creates a location type.
   * Delegates creation and integrity rules to command/application layer.
   * Returns a standardized success response.
   */
  @ApiOperation({ summary: 'Create location type', description: 'Creates a location type.' })
  @ApiOkResponse({ description: 'Standardized response with operation message.', type: [LocationTypeDto] })
  @Post('/locations/types')
  async createLocationType(@Body() body: LocationTypeRequestDto ): Promise<httpControllerResponse> {
    await this.createLocationTypeCommand.execute(body.location_type_name);

    const httpResponseFormatter = new httpFormatter();
    return httpResponseFormatter.createResponse('Location type created successfully');
  }

  /**
   * Creates a furniture record associated with a location.
   * Delegates behavior to command layer.
   * Returns a standardized success response.
   */
  @ApiOperation({ summary: 'Create furniture', description: 'Creates a furniture record.' })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
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

  /**
   * Modifies one furniture record identified by route param.
   * Accepts partial payload and delegates to command layer.
   * Returns a standardized success response.
   */
  @ApiOperation({ summary: 'Modify furniture', description: 'Updates a furniture record by ID.' })
  @ApiParam({ name: 'id_furniture', description: 'Furniture identifier', type: String })
  @ApiOkResponse({ description: 'Standardized response with operation message.' })
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