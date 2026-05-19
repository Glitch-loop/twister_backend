// Libraries
import { Injectable, Inject } from '@nestjs/common';

// Interfaces
import { LocationRepository } from '@/src/clients/core/interfaces/location.repository';

// Shared interfaces
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

// Aggregates
import { ClientAggregate } from '@/src/clients/core/aggregates/client.aggregate';

// Entities
import { LocationEntity } from '@/src/clients/core/entities/location.entity';
import { TaxClientInformationEntity } from '@/src/clients/core/entities/tax-client-information.entity';
import { ClientRepository } from '@/src/clients/core/interfaces/client.repository';

@Injectable()
export class CreationNoteCommand {
	constructor(
		@Inject(LocationRepository) private readonly locationRepository: LocationRepository,
		@Inject(IntegrityRepository) private readonly integrityRepository: IntegrityRepository,
		@Inject(ClientRepository) private readonly clientRepository: ClientRepository,
	) {}

	async execute(
		_id_location: string,
		_note: string,
		_created_at?: Date,
	): Promise<void> {
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

		const client: TaxClientInformationEntity = clients[0];

		const clientAggregate: ClientAggregate = new ClientAggregate(client, [location], []);

		clientAggregate.createNoteForLocation(
			this.integrityRepository.generateUUIDv4(),
			_id_location,
			_note,
			_created_at,
		);

		const updatedLocation = clientAggregate.locations.find(
			(loc) => loc.id_location === _id_location,
		);

		if (updatedLocation === undefined) {
			throw new Error(`Location with id ${_id_location} does not exist after note creation.`);
		}

		await this.locationRepository.updateLocation(_id_location, {
			notes: updatedLocation.notes,
			updated_at: updatedLocation.updated_at,
		});
	}
}
