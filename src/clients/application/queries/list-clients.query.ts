// Libraries
import { Inject, Injectable } from '@nestjs/common';

// Interface
import { ClientRepository } from '@/src/clients/core/interfaces/client.repository';

// Entities
import { TaxClientInformationEntity } from '@/src/clients/core/entities/tax-client-information.entity';

// DTOs
import { ClientDto } from '../dtos/client.dto';

// Mapper
import { Mapper } from '@/src/clients/application/mappers/entity-dto.mapper';

@Injectable()
export class ListClientsQuery {
	constructor(
		@Inject(ClientRepository) private readonly clientRepository: ClientRepository,
		private readonly mapper: Mapper,
	) {}

	async execute(
    limit?: number,
    lastCreatedAt?: Date,
    lastIdClient?: string,
    cellphone?: string, 
    email?: string, 
    legal_name?: string, 
    name?: string,
  ): Promise<ClientDto[]> {
    let limit_to_use: number = 100;

    if(lastCreatedAt && lastIdClient === undefined || lastCreatedAt === undefined && lastIdClient) throw new Error('If consulting a page larger than 1, pagination metadata is required.')
    
    if(limit) {
      if(limit <= 100) {
        limit_to_use = limit
      }
    }
    
		const clients: TaxClientInformationEntity[] = await this.clientRepository.listClients(
      limit_to_use,
      lastCreatedAt,
      lastIdClient,
      cellphone,
      email,
      legal_name,
      name,
    );
		return clients.map((client: TaxClientInformationEntity) => this.mapper.toDto(client));
	}
}
