import { TaxClientInformationEntity } from '@/src/clients/core/entities/tax-client-information.entity';

export abstract class ClientRepository {
  abstract createClient(client: TaxClientInformationEntity): Promise<void>;
  abstract retrieveClientById(id_client: string[]): Promise<TaxClientInformationEntity[]>;
  abstract updateClient(id_client: string, updatedData: Partial<TaxClientInformationEntity>): Promise<void>;
  abstract deleteClient(id_client: string[]): Promise<void>;
  abstract listClients(): Promise<TaxClientInformationEntity[]>;
}
