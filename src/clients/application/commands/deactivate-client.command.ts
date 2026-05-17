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
export class DeactivateClientCommand {
	constructor(
		@Inject(LocationRepository) private readonly locationRepository: LocationRepository,
		@Inject(ClientRepository) private readonly clientRepository: ClientRepository,
	) {}

	async execute(_id_client: string): Promise<void> {
		const clients: TaxClientInformationEntity[] = await this.clientRepository.retrieveClientById([
			_id_client,
		]);

		if (clients.length === 0) {
			throw new Error(`Client with id ${_id_client} does not exist.`);
		}

		const clientLocations: LocationEntity[] = await this.locationRepository.retrieveLocationByClient(_id_client);

		const clientAggregate: ClientAggregate = new ClientAggregate(
			clients[0],
			clientLocations,
			[],
		);

		clientAggregate.deactivateClient();

		await this.clientRepository.updateClient(_id_client, {
			updated_at: clientAggregate.taxClientInformation!.updated_at,
		});

		await Promise.all(
			clientAggregate.locations.map((location) =>
				this.locationRepository.updateLocation(location.id_location, {
					status_location: location.status_location,
					updated_at: location.updated_at,
				}),
			),
		);
	}
}
