import { Injectable } from '@nestjs/common';
import { ClientRepository } from '@/src/clients/core/interfaces/client.repository';
import { SupabaseDataSource } from '@/src/infrastructure/datasources/supabase-data-source';
import { Mapper } from '@/src/clients/application/mappers/entity-model.mapper';
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
  ): Promise<TaxClientInformationEntity[]> {
    const query = this.supabase.from('clients').select();
    
    if(cellphone) query.eq('cellphone', cellphone)
    if(email) query.eq('email', email)
    
    if(legal_name) query.ilike('legal_name', legal_name)
    if(name) query.ilike('name', name)

    if (lastCreatedAt && lastIdClient) {
      const createdAtCursor = lastCreatedAt;
      // Keyset pagination for DESC order: older rows, then UUID tie-breaker.
      query.or(
        `created_at.lt."${createdAtCursor}",and(created_at.eq."${createdAtCursor}",id_client.lt."${lastIdClient}")`,
      );
    }

    query.order('created_at', { ascending: false})
    query.order('id_client', { ascending: false})

    const { data, error } = await query.limit(limit);
    if (error) {
      throw new Error(`Failed to list clients: ${error.message}`);
    }

    return (data as ClientModel[]).map((client) =>
      this.mapper.toDomainObject(client),
    );
  }
}




/**
        { OK - 1
            "id_client": "c2e222e2-5afb-4030-a8a4-f618f53463ba",
            "legal_name": "Cliente prueba 1",
            "postal_code": "48327",
            "fiscal_regime": "Persona moral de dividendos",
            "name": "Cliente 1",
            "cellphone": "3221234657",
            "email": "jhondoe@gmail.com",
            "created_at": "2026-05-22T17:21:00.464Z",
            "updated_at": "2026-05-22T17:21:00.464Z"
       
       Next client: eyJsaW1pdCI6MSwiaWQiOiJjMmUyMjJlMi01YWZiLTQwMzAtYThhNC1mNjE4ZjUzNDYzYmEiLCJjcmVhdGVkX2F0IjoiMjAyNi0wNS0yMlQxNzoyMTowMC40NjRaIn0=
            },
        { OK - 2
            "id_client": "648f4575-f575-439f-916b-4c1e4ae68b06",
            "legal_name": "Cliente prueba 1",
            "postal_code": "48327",
            "fiscal_regime": "Persona moral de dividendos",
            "name": "Cliente 1",
            "cellphone": "3221234657",
            "email": "jhondoe@gmail.com",
            "created_at": "2026-05-22T17:20:42.136Z",
            "updated_at": "2026-05-22T17:20:42.136Z"
          Next client: eyJsaW1pdCI6MSwiaWQiOiI2NDhmNDU3NS1mNTc1LTQzOWYtOTE2Yi00YzFlNGFlNjhiMDYiLCJjcmVhdGVkX2F0IjoiMjAyNi0wNS0yMlQxNzoyMDo0Mi4xMzZaIn0=
        },
        { OK - 3
            "id_client": "1fcefcfc-8f4f-446c-b89d-3942307cc67f",
            "legal_name": "Cliente prueba 1.2",
            "postal_code": "48327",
            "fiscal_regime": "Persona fisica",
            "name": "Cliente 1",
            "cellphone": "3221234657",
            "email": "jhondoe@gmail.com",
            "created_at": "2026-05-17T13:16:42.842Z",
            "updated_at": "2026-05-19T00:16:11.118Z"
          Meta: eyJsaW1pdCI6MSwiaWQiOiIxZmNlZmNmYy04ZjRmLTQ0NmMtYjg5ZC0zOTQyMzA3Y2M2N2YiLCJjcmVhdGVkX2F0IjoiMjAyNi0wNS0xN1QxMzoxNjo0Mi44NDJaIn0=
        },
        { OK - 4
            "id_client": "041c6093-a97b-4f4c-ab8e-6d1e35689555",
            "legal_name": "PÚBLICO EN GENERAL",
            "postal_code": "48327",
            "fiscal_regime": "616 – Sin obligaciones fiscales",
            "name": "PÚBLICO EN GENERAL",
            "cellphone": "0000000000",
            "email": "Ninguno",
            "created_at": "2026-05-13T19:01:48.000Z",
            "updated_at": "2026-05-13T19:01:52.000Z"
          Meta: nulls
        }
 */