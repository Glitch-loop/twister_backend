import { Injectable } from '@nestjs/common';
import { ClientRepository } from '@/src/clients/core/interfaces/client.repository';
import { SupabaseDataSource } from '@/src/infrastructure/datasources/supabase-data-source';
import { Mapper } from '@/src/application/mappers/entity-model.mapper';
import { TaxClientInformationEntity } from '@/src/clients/core/entities/tax-client-information.entity';
import { ClientModel } from '@/src/clients/application/models/client.model';

@Injectable()
export class ClientSupabase implements ClientRepository {
  constructor(
    private readonly supabaseDataSource: SupabaseDataSource,
    private readonly mapper: Mapper,
  ) {}

  private get supabase() {
    return this.supabaseDataSource.getClient();
  }

  async createClient(client: TaxClientInformationEntity): Promise<void> {
    try {

      const clientModel = this.mapper.toModel(client);
      const { data, error } = await this.supabase.from('clients').insert(clientModel);
      if (error) {
        throw new Error('Failed to create client');
      }
    } catch (error) {
      throw new Error('Failed to create client', { cause: error instanceof Error ? error : undefined });
    }
  }

  async retrieveClientById(id_client: string[]): Promise<TaxClientInformationEntity[]> {
    try {
      const { data, error } = await this.supabase
        .from('clients')
        .select()
        .in('id_client', id_client);

      if (error) {
        throw new Error('Failed to retrieve client by ID');
      }

      if (!data || data.length === 0) {
        return [];
      }

      return (data as ClientModel[]).map((client) => this.mapper.toDomainObject(client));
    } catch (error) {
      throw new Error('Failed to retrieve client by ID', { cause: error instanceof Error ? error : undefined });
    }
  }

  async updateClient(
    id_client: string,
    updatedData: Partial<TaxClientInformationEntity>,
  ): Promise<void> {
    const payload: Partial<ClientModel> = {
      ...(updatedData.legal_name !== undefined && { legal_name: updatedData.legal_name }),
      ...(updatedData.postal_code !== undefined && { postal_code: updatedData.postal_code }),
      ...(updatedData.fiscal_regime !== undefined && { fiscal_regime: updatedData.fiscal_regime }),
      ...(updatedData.name !== undefined && { name: updatedData.name }),
      ...(updatedData.cellphone !== undefined && { cellphone: updatedData.cellphone }),
      ...(updatedData.email !== undefined && { email: updatedData.email }),
      ...(updatedData.created_at !== undefined && { created_at: updatedData.created_at }),
      ...(updatedData.updated_at !== undefined && { updated_at: updatedData.updated_at }),
    };

    const { error } = await this.supabase
      .from('clients')
      .update(payload)
      .eq('id_client', id_client);

    if (error) {
      throw new Error('Failed to update client', { cause: error instanceof Error ? error : undefined });
    }
  }


  async deleteClient(id_client: string[]): Promise<void> {
    const { error } = await this.supabase
      .from('clients')
      .delete()
      .in('id_client', id_client);

    if (error) {
      throw new Error('Failed to delete client', { cause: error instanceof Error ? error : undefined });
    }
  }

  async listClients(): Promise<TaxClientInformationEntity[]> {
    const { data, error } = await this.supabase.from('clients').select();

    if (error) {
      throw new Error('Failed to list clients');
    }

    return (data as ClientModel[]).map((client) =>
      this.mapper.toDomainObject(client),
    );
  }
}
