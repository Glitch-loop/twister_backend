// Libraries
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter'

// Interfaces
import { LocationRepository } from '@/src/clients/core/interfaces/location.repository';
import { ClientRepository } from '@/src/clients/core/interfaces/client.repository';

// Aggregates
import { ClientAggregate } from '@/src/clients/core/aggregates/client.aggregate';

// Entities
import { LocationEntity } from '@/src/clients/core/entities/location.entity';
import { TaxClientInformationEntity } from '@/src/clients/core/entities/tax-client-information.entity';


// Enums
import { DOMAIN_EVENT_ENUM } from '@/src/shared/core/enums/domain-event.enum';
import type { ConfirmedClientEvent } from '@/src/shared/events/interfaces/ConfirmedClientEvent';
import { BusinessRuleException } from '@/src/shared/errors/BusinessRuleException';

console.log("LISTENER ENUM CHECK:", DOMAIN_EVENT_ENUM.CONFIRMED_CLIENT_EVENT);

@Injectable()
export class CreateNewLocationListener {
  constructor(
    @Inject(forwardRef(() => LocationRepository)) private readonly locationRepository: LocationRepository,
    @Inject(forwardRef(() => ClientRepository)) private readonly clientRepository: ClientRepository,
  ) { }

  @OnEvent(DOMAIN_EVENT_ENUM.CONFIRMED_CLIENT_EVENT, { async: true })
  async handleClientConfirmed(payload: ConfirmedClientEvent) {
    console.log("MODIFYING LOCATION DOMAIN EVENT LISTENER.")
    console.log(payload)
    try {
      const idLocation  = payload.idLocation;
      const locations: LocationEntity[] = await this.locationRepository.retrieveLocationById([
        idLocation,
      ]);
      const existingLocation: LocationEntity = locations[0];
      const{ id_client } = existingLocation;
      const clients: TaxClientInformationEntity[] = await this.clientRepository.retrieveClientById([
        id_client,
      ]);

      const clientAggregate: ClientAggregate = new ClientAggregate(clients[0], [existingLocation], []);

      const locationToUpdate:LocationEntity = clientAggregate.confirmNewClient(idLocation);

      await this.locationRepository.updateLocation(idLocation, {
        street: locationToUpdate.street,
        ext_number: locationToUpdate.ext_number,
        colony: locationToUpdate.colony,
        postal_code: locationToUpdate.postal_code,
        location_name: locationToUpdate.location_name,
        latitude: locationToUpdate.latitude,
        longitude: locationToUpdate.longitude,
        status_location: locationToUpdate.status_location,
        id_creator: locationToUpdate.id_creator,
        id_client: locationToUpdate.id_client,
        updated_at: locationToUpdate.updated_at,
        location_type: locationToUpdate.location_type,
        address_reference: locationToUpdate.address_reference,
      });
    } catch (error) {
      // Log this to a file or monitoring tool so you don't lose the record
      throw new BusinessRuleException('Something were wrong at moment of confirming a new error: ' + error)
    }		
  }
}
