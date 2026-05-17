// Libraries
import { Injectable, Inject } from '@nestjs/common'; 

// Interfaces
import { ClientRepository } from '@/src/clients/core/interfaces/client.repository';

// Aggregates
import { ClientAggregate } from '@/src/clients/core/aggregates/client.aggregate';

// Dtos

// Entity
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

@Injectable()
export class CreateClientCommand {
  constructor(
    @Inject(ClientRepository) private readonly clientRepository: ClientRepository,
    @Inject(IntegrityRepository) private readonly integrityRepository: IntegrityRepository,
  ) { }

  async execute(
    _legal_name: string,
    _postal_code: string,
    _fiscal_regime: string,
    _name: string,
    _cellphone: string,
    _email: string,
    _id_client?: string,
  ): Promise<void> {
    const clientAggregate: ClientAggregate = new ClientAggregate(null, [], []);

    clientAggregate.createClient(
      _id_client ?? this.integrityRepository.generateUUIDv4(),
      _legal_name,
      _postal_code,
      _fiscal_regime,
      _name,
      _cellphone,
      _email
    );

    await this.clientRepository.createClient(clientAggregate.taxClientInformation!);
  }
}
