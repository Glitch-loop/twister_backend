// Libraries
import { Injectable, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter'

// Interfaces
import { LocationRepository } from '@/src/clients/core/interfaces/location.repository';
import { ClientRepository } from '@/src/clients/core/interfaces/client.repository';

// Aggregates
import { ClientAggregate } from '@/src/clients/core/aggregates/client.aggregate';

// Entities
import { LocationEntity } from '@/src/clients/core/entities/location.entity';
import { TaxClientInformationEntity } from '@/src/clients/core/entities/tax-client-information.entity';

// Object values
import { LocationTypeObjectValue } from '@/src/clients/core/object-values/location-type.object-value';

// Enums
import { LOCATION_STATUS_ENUM } from '@/src/clients/core/enums/client-status.enum';
import { Mapper } from '../mappers/entity-dto.mapper';
import { DOMAIN_EVENT_ENUM } from '@/src/shared/core/enums/domain-event.enum';
import type { ConfirmedClientEvent } from '@/src/shared/events/interfaces/ConfirmedClientEvent';
import { BusinessRuleException } from '@/src/shared/errors/BusinessRuleException';

@Injectable()
export class ModifyLocationCommand {
	constructor(
		@Inject(LocationRepository) private readonly locationRepository: LocationRepository,
		@Inject(ClientRepository) private readonly clientRepository: ClientRepository,
		private readonly mapper: Mapper,
	) {}

	async execute(
		_id_location: string,
		_street?: string,
		_ext_number?: string,
		_colony?: string,
		_postal_code?: string,
		_location_name?: string,
		_latitude?: string,
		_longitude?: string,
		_status_location?: number,
		_id_creator?: string,
		_id_client?: string,
		_id_location_type?: string,
		_address_reference?: string | null,
	): Promise<void> {
		const statusLocationCastedToEnum: LOCATION_STATUS_ENUM|undefined = _status_location ? this.mapper.toLocationStatusEnum(_status_location) : undefined;

		const locations: LocationEntity[] = await this.locationRepository.retrieveLocationById([
			_id_location,
		]);

		if (locations.length === 0) {
			throw new Error(`Location with id ${_id_location} does not exist.`);
		}

		const existingLocation: LocationEntity = locations[0];
		const{ id_client } = existingLocation;
		const clients: TaxClientInformationEntity[] = await this.clientRepository.retrieveClientById([
			id_client,
		]);

		if (clients.length === 0) {
			throw new Error(`Client with id ${id_client} does not exist.`);
		}

		let locationType: LocationTypeObjectValue | undefined;

		if (_id_location_type !== undefined) {
			const locationTypes = await this.locationRepository.retrieveLocationTypeById([
				_id_location_type,
			]);

			if (locationTypes.length === 0) {
				throw new Error(`Location type with id ${_id_location_type} does not exist.`);
			}

			locationType = locationTypes[0];
		}

		const clientAggregate: ClientAggregate = new ClientAggregate(clients[0], [existingLocation], []);

		const updatedLocation = clientAggregate.modifyLocation(
			_id_location,
			_street,
			_ext_number,
			_colony,
			_postal_code,
			_location_name,
			_latitude,
			_longitude,
			statusLocationCastedToEnum,
			_id_creator,
			_id_client,
			locationType,
			_address_reference,
		);

		await this.locationRepository.updateLocation(_id_location, {
			street: updatedLocation.street,
			ext_number: updatedLocation.ext_number,
			colony: updatedLocation.colony,
			postal_code: updatedLocation.postal_code,
			location_name: updatedLocation.location_name,
			latitude: updatedLocation.latitude,
			longitude: updatedLocation.longitude,
			status_location: updatedLocation.status_location,
			id_creator: updatedLocation.id_creator,
			id_client: updatedLocation.id_client,
			updated_at: updatedLocation.updated_at,
			location_type: updatedLocation.location_type,
			address_reference: updatedLocation.address_reference,
		});
	}

	@OnEvent(DOMAIN_EVENT_ENUM.CONFIRMED_CLIENT_EVENT, { async: true })
	private async handleClientConfirmed(event: ConfirmedClientEvent) {
		try {
			const { idLocation } = event;
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
