// Libraries
import { Injectable } from '@nestjs/common';

// Interfaces
import { ClientRepository } from '@/src/clients/core/interfaces/client.repository';

// Datasources
import { SupabaseDataSource } from '@/src/shared/infrastructure/datasources/supabase-data-source';

// Entities
import { TaxClientInformationEntity } from '@/src/clients/core/entities/tax-client-information.entity';

// Models
import { ClientModel } from '@/src/clients/application/models/client.model';

// Mapper
import { Mapper } from '@/src/clients/application/mappers/entity-model.mapper';

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
      const { error } = await this.supabase.from('clients').insert(clientModel);
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
        throw new Error('Failed to retrieve client by ID' + error.message);
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

  async listClients(
    limit: number,
    lastCreatedAt?: string,
    lastIdClient?: string,
    cellphone?: string, 
    email?: string, 
    legal_name?: string, 
    name?: string,
    postal_code?: string,
  ): Promise<TaxClientInformationEntity[]> {
    const query = this.supabase.from('clients').select();
    
    if(cellphone) query.eq('cellphone', `${cellphone}`)
      
    if(email) query.like('email', `%${email}%`)
    if(legal_name) query.like('legal_name', `%${legal_name}%`)
    if(name) query.ilike('name', `%${name}%`)
    if(postal_code) query.ilike('postal_code', `%${postal_code}%`)

    if (lastCreatedAt && lastIdClient) {
      const createdAtCursor = lastCreatedAt;
      // Keyset pagination for DESC order: older rows, then UUID tie-breaker.
      query.or(
        `created_at.lt."${createdAtCursor}",and(created_at.eq."${createdAtCursor}",id_client.lt."${lastIdClient}")`,
      );
    }

    query.order('created_at', { ascending: false})
    query.order('id_client', { ascending: false})

    console.log(cellphone)
    console.log(query)

    const { data, error } = await query.limit(limit);
    if (error) {
      throw new Error(`Failed to list clients: ${error.message}`);
    }

    return (data as ClientModel[]).map((client) =>
      this.mapper.toDomainObject(client),
    );
  }
}