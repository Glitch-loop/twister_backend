// Libraries
import { Inject, Injectable } from '@nestjs/common';

// Interface
import { ClientRepository } from '@/src/clients/core/interfaces/client.repository';

// Entities
import { TaxClientInformationEntity } from '@/src/clients/core/entities/tax-client-information.entity';

// DTOs
import { ClientDto } from '@/src/clients/application/dtos/client.dto';

// Mapper
import { Mapper } from '@/src/clients/application/mappers/entity-dto.mapper';

@Injectable()
export class RetrieveClientsByIdQuery {
	constructor(
		@Inject(ClientRepository) private readonly clientRepository: ClientRepository,
		private readonly mapper: Mapper,
	) {}

	async execute(id_client: string[]): Promise<ClientDto[]> {
		const maxIds = 1000;
		const idClientToRetrieve = id_client.slice(0, maxIds);

		const clients: TaxClientInformationEntity[] = await this.clientRepository.retrieveClientById(
			idClientToRetrieve,
		);

		return clients.map((client: TaxClientInformationEntity) => this.mapper.toDto(client));
	}
}
