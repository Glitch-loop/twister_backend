// Libraries
import { Injectable, Inject } from '@nestjs/common';

// Interfaces
import { ClientRepository } from '@/src/clients/core/interfaces/client.repository';

// Aggregates
import { ClientAggregate } from '@/src/clients/core/aggregates/client.aggregate';

// Entities
import { TaxClientInformationEntity } from '@/src/clients/core/entities/tax-client-information.entity';

@Injectable()
export class ModifyClientCommand {
	constructor(
		@Inject(ClientRepository) private readonly clientRepository: ClientRepository,
	) {}

	async execute(
		_id_client: string,
		_legal_name?: string,
		_postal_code?: string,
		_fiscal_regime?: string,
		_name?: string,
		_cellphone?: string,
		_email?: string,
	): Promise<void> {

		const clients: TaxClientInformationEntity[] = await this.clientRepository
      .retrieveClientById([ _id_client ]);

    if (clients.length === 0) {
			throw new Error(`Client with id ${_id_client} does not exist.`);
		}

		const clientAggregate: ClientAggregate = new ClientAggregate(clients[0], [], []);
		const updatedClient = clientAggregate.modifyClient(
			_legal_name,
			_postal_code,
			_fiscal_regime,
			_name,
			_cellphone,
			_email,
		);

		await this.clientRepository.updateClient(_id_client, {
			legal_name: updatedClient.legal_name,
			postal_code: updatedClient.postal_code,
			fiscal_regime: updatedClient.fiscal_regime,
			name: updatedClient.name,
			cellphone: updatedClient.cellphone,
			email: updatedClient.email,
			updated_at: updatedClient.updated_at,
		});
	}
}
