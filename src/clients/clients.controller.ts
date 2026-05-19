// Libraries
import { Body, Controller, Post, Get, Patch, Param } from '@nestjs/common';

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

@Controller('clients')
export class ClientsController {
  constructor(
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
    private readonly listLocationTypesQuery: ListLocationTypesQuery,
  ) {}

  @Post('/')
  async createClient(@Body() body: Partial<ClientDto>) {
    await this.createClientCommand.execute(
      body.legal_name!,
      body.postal_code!,
      body.fiscal_regime!,
      body.name!,
      body.cellphone!,
      body.email!,
      body.id_client,
    );

    return { message: 'Client created successfully' };
  }

  @Patch('/:id_client')
  async modifyClient(
    @Param('id_client') id_client: string,
    @Body() body: Partial<ClientDto>,
  ) {
    await this.modifyClientCommand.execute(
      id_client,
      body.legal_name,
      body.postal_code,
      body.fiscal_regime,
      body.name,
      body.cellphone,
      body.email,
    );

    return { message: 'Client modified successfully' };
  }

  @Patch('/:id_client/deactivate')
  async deactivateClient(@Param('id_client') id_client: string) {
    await this.deactivateClientCommand.execute(id_client);
    return { message: 'Client deactivated successfully' };
  }

  @Post('/locations')
  async createLocation(@Body() body: Partial<LocationDto>) {
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

    return { message: 'Location created successfully' };
  }

  @Patch('/locations/:id_location')
  async modifyLocation(
    @Param('id_location') id_location: string,
    @Body() body: Partial<LocationDto>,
  ) {
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

    return { message: 'Location modified successfully' };
  }

  @Patch('/locations/:id_location/deactivate/:deactivation_type')
  async deactivateLocation(
    @Param('id_location') id_location: string,
    @Param('deactivation_type') deactivation_type: string,
  ) {
    await this.deactivateLocationCommand.execute(id_location, parseInt(deactivation_type, 10));
    return { message: 'Location deactivated successfully' };
  }

  @Post('/locations/:id_location/notes')
  async createLocationNote(
    @Param('id_location') id_location: string,
    @Body() body: Partial<LocationNoteDto>,
  ) {
    await this.creationNoteCommand.execute(
      id_location,
      body.note!,
      body.created_at,
    );

    return { message: 'Location note created successfully' };
  }

  @Get('/locations/types')
  async listLocationTypes() {
    const locationTypes = await this.listLocationTypesQuery.execute();

    return { message: 'Location types retrieved successfully', data: locationTypes };
  }

  @Post('/locations/types')
  async createLocationType(@Body() body: Partial<LocationTypeDto>) {
    await this.createLocationTypeCommand.execute(body.location_type_name!);
    return { message: 'Location type created successfully' };
  }

  @Post('/locations/furnitures')
  async createFurniture(@Body() body: Partial<FurnitureDto>) {
    await this.createFurnitureCommand.execute(
      body.delivered_date!,
      body.description_furniture!,
      body.id_location!,
    );

    return { message: 'Furniture created successfully' };
  }

  @Patch('/locations/furnitures/:id_furniture')
  async modifyFurniture(
    @Param('id_furniture') id_furniture: string,
    @Body() body: Partial<FurnitureDto>,
  ) {
    await this.modifyFurnitureCommand.execute(
      id_furniture,
      body.delivered_date,
      body.description_furniture,
      body.id_location,
    );

    return { message: 'Furniture modified successfully' };
  }
}