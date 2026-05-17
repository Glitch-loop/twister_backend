// Libraries
import { Injectable, Inject } from '@nestjs/common';

// Interfaces
import { LocationRepository } from '@/src/clients/core/interfaces/location.repository';
import { ClientRepository } from '@/src/clients/core/interfaces/client.repository';

// Aggregates
import { ClientAggregate } from '@/src/clients/core/aggregates/client.aggregate';

// Entities
import { LocationEntity } from '@/src/clients/core/entities/location.entity';
import { FurnitureEntity } from '@/src/clients/core/entities/furniture.entity';
import { TaxClientInformationEntity } from '@/src/clients/core/entities/tax-client-information.entity';

@Injectable()
export class ModifyFurnitureCommand {
	constructor(
		@Inject(LocationRepository) private readonly locationRepository: LocationRepository,
		@Inject(ClientRepository) private readonly clientRepository: ClientRepository,
	) {}

	async execute(
		_id_furniture: string,
		_delivered_date?: Date,
		_description_furniture?: string,
		_id_location?: string,
	): Promise<void> {
		const furnitures: FurnitureEntity[] = await this.locationRepository.retrieveFurnitureById([
			_id_furniture,
		]);

		if (furnitures.length === 0) {
			throw new Error(`Furniture with id ${_id_furniture} does not exist.`);
		}

		const furniture = furnitures[0];
		const locationIds: string[] = Array.from(
			new Set([furniture.id_location, _id_location].filter((id): id is string => id !== undefined)),
		);
		const locations: LocationEntity[] = await this.locationRepository.retrieveLocationById(locationIds);

		if (locations.length === 0) {
			throw new Error('No matching location found for furniture update.');
		}

		const targetLocationId = _id_location ?? furniture.id_location;
		const targetLocation = locations.find((location) => location.id_location === targetLocationId);

		if (targetLocation === undefined) {
			throw new Error(`Location with id ${targetLocationId} does not exist.`);
		}

		const clients: TaxClientInformationEntity[] = await this.clientRepository.retrieveClientById([
			targetLocation.id_client,
		]);

		if (clients.length === 0) {
			throw new Error(`Client with id ${targetLocation.id_client} does not exist.`);
		}

		const clientAggregate: ClientAggregate = new ClientAggregate(clients[0], locations, [furniture]);
		const updatedFurniture = clientAggregate.modifyFurniture(
			_id_furniture,
			_delivered_date,
			_description_furniture,
			_id_location,
		);

		await this.locationRepository.updateFurniture(_id_furniture, {
			delivered_date: updatedFurniture.delivered_date,
			description_furniture: updatedFurniture.description_furniture,
			id_location: updatedFurniture.id_location,
		});
	}
}
