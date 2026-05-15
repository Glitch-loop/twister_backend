---
name: Create supabase implementation
description: This prompt is used when the user wants to create a new Supabase implementation.
---

This prompt is used when the user asks for implementing a repository using supabase as datasource.

# Input:
- You'll recieve the name of the repository to implement.
- Schema of the database table that are implied in the implementation of the repository.

> Remember the schema will be used in a typescript application. So you have to define the schema in typescript.

# Steps to follow:
* You have to locate the repository file, you'll find it in `@/src/infrastructure/repositories/supabase`..
* Understand the repository and its methods that you have to implement.
* Identify the domain object that are implied
- entities `src/core/entities`
- object values `src/core/object-values` 
- enums `src/core/enums` that are implied.
- models `src/application/models` that are implied.
  - If an entity is composed by object values, enums or other entities, you must find and understand them before making any implementation.
* Once you have identified all the domain objects that compound the repository, you have to find the "tables" that are implied `src/infrastructure/postgres/schema`.  
* Once you have the table schema and domain object understood, you are going to implement the repository using supabase as datasource.
- The implementation will have 2 dependencies:
- `SupabaseDataSource` located at `src/infrastructure/datasources/supabase/supabase.datasource.ts` and the `Mapper` located at `src/application/mappers/mapper.ts`.
* Once you have created the method to get the supabase client, you can start implementing the methods of the repository.
* Remember each method implementation should be wrapped in a try catch block, and in case of an error, you should throw an error with a descriptive message of what happened.
* You'll locate the file with the implementation at `src/infrastructure/repositories/supabase` and the file name should be the name of the repository + `-supabase` and `.repository.ts` . i.e. if the repository is `ClientRepository` the file name should be `client-supabase.repository.ts`.

Example: 
# Input
Implement client repository using supabase.
The tables that are implied are:
- clients

# Process
1. I need to implement a repository called `ClientRepository` using supabase as datasource. This is located at `src/infrastructure/repositories/ClientRepository.ts`.
2. I see that the methods that I have to implement are: `createClient`, `getClientById`, `updateClient`, `deleteClient` and `listClients`. 
  - I need to identify the domain object that are implied in the repository. I see that the main entity is `ClientEntity` located at `src/core/entities/clientEntity.ts`. I need to understand this entity before making any implementation.
  - I see that `ClientEntity` is composed by the following attributes: `id_client`, `legal_name`, `postal_code`, `fiscal_regime`, `name`, `cellphone`, `email`, `created_at` and `updated_at`. I need to understand each of these attributes and their types before making any implementation.
  - I see that `ClientEntity` has a relation with `LocationEntity` through the attribute `id_client`, I need to understand `LocationEntity` before making any implementation.
  - I see that `LocationEntity` has a relation with `LocationTypeEnum` through the attribute `type`, I need to understand `LocationTypeEnum` before making any implementation.
  - Once I have understood the entity and its relations, I need to find the tables schema that are implied in the implementation according to the user's input. According to users input the tables implied are `locations`, `furnitures`, `location_notes` and `location_types`.
  I consult the file located at `src/infrastructure/postgres/schema/locationSchema.ts`. I found: 
  ```
    CREATE TABLE public.locations (
      id_location uuid NOT NULL DEFAULT gen_random_uuid(),
      street character varying NOT NULL,
      ext_number character varying NOT NULL,
      colony character varying NOT NULL,
      postal_code character varying NOT NULL,
      address_reference text,
      location_name character varying NOT NULL,
      latitude character varying NOT NULL,
      longitude character varying NOT NULL,
      status_location smallint NOT NULL,
      id_creator uuid NOT NULL,
      id_client uuid NOT NULL,
      id_location_type uuid NOT NULL,
      created_at timestamp with time zone NOT NULL,
      updated_at timestamp with time zone NOT NULL,
      CONSTRAINT locations_pkey PRIMARY KEY (id_location),
      CONSTRAINT locations_id_creator_fkey FOREIGN KEY (id_creator) REFERENCES public.users (id_user),
      CONSTRAINT locations_id_client_fkey FOREIGN KEY (id_client) REFERENCES public.clients (id_client),
      CONSTRAINT locations_id_location_type_fkey FOREIGN KEY (id_location_type) REFERENCES public.location_types (id_location_type)
    );
  CREATE TABLE public.location_notes (
    id_location_note uuid NOT NULL DEFAULT gen_random_uuid(),
    note text NOT NULL,
    id_location uuid NOT NULL,
    CONSTRAINT location_notes_pkey PRIMARY KEY (id_location_note),
    CONSTRAINT location_notes_id_location_fkey FOREIGN KEY (id_location) REFERENCES public.locations (id_location)
  );
  CREATE TABLE public.furnitures (
    id_furniture uuid NOT NULL DEFAULT gen_random_uuid(),
    delivered_date timestamp with time zone NOT NULL,
    description_furniture text NOT NULL,
    id_location uuid NOT NULL,
    CONSTRAINT furnitures_pkey PRIMARY KEY (id_furniture),
    CONSTRAINT furnitures_id_location_fkey FOREIGN KEY (id_location) REFERENCES public.locations (id_location)
  );
  CREATE TABLE public.location_types (
    id_location_type uuid NOT NULL DEFAULT gen_random_uuid(),
    location_type_name character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT location_types_pkey PRIMARY KEY (id_location_type)
  );
  ```sql
- I have the big picture of the entity, its relations and the tables implied in the implementation of the repository, now I can start implementing the repository using supabase as datasource.
3. I begin to implementing the repository. I import `SupabaseDataSource` and inject it in the constructor, then I implement the method to get the supabase client. Once done, I start to implement each method of the repository according to its functionality and the schema of the tables implied.

At the end I'll have a complete implementation of the repository using supabase as datasource, and I can move on to the next task.
```typescript
import { Injectable } from '@nestjs/common';
import { ClientRepository } from '@/src/core/Interfaces/client.repository';
import { SupabaseDataSource } from '@/src/infrastructure/datasources/supabase-data-source';
import { Mapper } from '@/src/application/mappers/mapper';
import { TaxClientInformationEntity } from '@/src/core/entities/tax-client-information.entity';
import { ClientModel } from '@/src/application/models/client.model';

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

```