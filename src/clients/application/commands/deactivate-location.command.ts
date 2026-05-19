// Libraries
import { Injectable, Inject } from '@nestjs/common';

// Interfaces
import { LocationRepository } from '@/src/clients/core/interfaces/location.repository';
import { ClientRepository } from '@/src/clients/core/interfaces/client.repository';

// Aggregates
import { ClientAggregate } from '@/src/clients/core/aggregates/client.aggregate';

// Entities
import { LocationEntity } from '@/src/clients/core/entities/location.entity';
import { TaxClientInformationEntity } from '@/src/clients/core/entities/tax-client-information.entity';

@Injectable()
export class DeactivateLocationCommand {
	constructor(
		@Inject(LocationRepository) private readonly locationRepository: LocationRepository,
		@Inject(ClientRepository) private readonly clientRepository: ClientRepository,
	) {}

	async execute(_id_location: string, _deactivation_type: number): Promise<void> {
		const locations: LocationEntity[] = await this.locationRepository.retrieveLocationById([
			_id_location,
		]);

		if (locations.length === 0) {
			throw new Error(`Location with id ${_id_location} does not exist.`);
		}

		const location: LocationEntity = locations[0];
		const clients: TaxClientInformationEntity[] = await this.clientRepository.retrieveClientById([
			location.id_client,
		]);

		if (clients.length === 0) {
			throw new Error(`Client with id ${location.id_client} does not exist.`);
		}

		const clientAggregate: ClientAggregate = new ClientAggregate(clients[0], [location], []);
		const updatedLocation = clientAggregate.deactivateLocation(_id_location, _deactivation_type);

		await this.locationRepository.updateLocation(_id_location, {
			status_location: updatedLocation.status_location,
			updated_at: updatedLocation.updated_at,
		});
	}
}
