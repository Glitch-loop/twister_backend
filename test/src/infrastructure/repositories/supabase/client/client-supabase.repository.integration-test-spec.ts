import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { randomUUID } from 'crypto';
import { ClientSupabase } from '@/src/clients/infrastructure/repositories/supabase/client-supabase.repository';
import { SupabaseDataSource } from '@/src/infrastructure/datasources/supabase-data-source';
import { Mapper } from '@/src/application/mappers/entity-model.mapper';
import { TaxClientInformationEntity } from '@/src/clients/core/entities/tax-client-information.entity';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildTestClient(
  overrides: Partial<TaxClientInformationEntity> = {},
): TaxClientInformationEntity {
  return new TaxClientInformationEntity(
    overrides.id_client ?? randomUUID(),
    overrides.legal_name ?? 'TEST Legal Name S.A. de C.V.',
    overrides.postal_code ?? '64000',
    overrides.fiscal_regime ?? '601',
    overrides.name ?? 'Test Client',
    overrides.cellphone ?? '8112345678',
    overrides.email ?? 'test@integration.test',
    overrides.created_at ?? new Date('2024-01-01T00:00:00.000Z'),
    overrides.updated_at ?? new Date('2024-01-01T00:00:00.000Z'),
  );
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('ClientSupabase – integration tests', () => {
  let repository: ClientSupabase;
  let dataSource: SupabaseDataSource;
  const createdIds: string[] = [];

  beforeAll(() => {
    if (
      !process.env.PUBLIC_SUPABASE_URL ||
      !process.env.PUBLIC_SUPABASE_ANON_KEY
    ) {
      throw new Error(
        'Integration tests require PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY environment variables.',
      );
    }

    dataSource = new SupabaseDataSource();
    const mapper = new Mapper();
    repository = new ClientSupabase(dataSource, mapper);
  });

  afterAll(async () => {
    // Clean up every record created during the suite
    const supabase = dataSource.getClient();
    if (createdIds.length > 0) {
      await supabase.from('clients').delete().in('id_client', createdIds);
    }
  });

  // -------------------------------------------------------------------------
  describe('createClient', () => {
    it('should insert a client without throwing', async () => {
      const client = buildTestClient();
      createdIds.push(client.id_client);

      await expect(repository.createClient(client)).resolves.toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  describe('retrieveClientById', () => {
    it('should return the client that was previously created', async () => {
      const client = buildTestClient();
      createdIds.push(client.id_client);
      await repository.createClient(client);

      const result = await repository.retrieveClientById([ client.id_client ]);
      expect(result).not.toBeNull();
      expect(result[0].id_client).toBe(client.id_client);
      expect(result[0].legal_name).toBe(client.legal_name);
      expect(result[0].name).toBe(client.name);
    });

    it('should return an empty array for a non-existent client', async () => {
      const result = await repository.retrieveClientById([randomUUID()]);
      expect(result).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  describe('updateClient', () => {
    it('should update the specified fields of an existing client', async () => {
      const client = buildTestClient();
      createdIds.push(client.id_client);
      await repository.createClient(client);

      await repository.updateClient(client.id_client, {
        name: 'Updated Name',
        email: 'updated@integration.test',
      });

      const updated = await repository.retrieveClientById([ client.id_client ]);
      expect(updated[0].name).toBe('Updated Name');
      expect(updated[0].email).toBe('updated@integration.test');
      // Untouched fields should remain
      expect(updated[0].legal_name).toBe(client.legal_name);
    });
  });

  // -------------------------------------------------------------------------
  describe('deleteClient', () => {
    it('should remove the client so it can no longer be retrieved', async () => {
      const client = buildTestClient();
      // Do NOT add to createdIds – we will delete it ourselves
      await repository.createClient(client);

      await repository.deleteClient([ client.id_client ]);

      const result = await repository.retrieveClientById([ client.id_client ]);
      expect(result).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  describe('listClients', () => {
    it('should include the newly created client in the returned list', async () => {
      const client = buildTestClient();
      createdIds.push(client.id_client);
      await repository.createClient(client);

      const list = await repository.listClients();

      const found = list.find((c) => c.id_client === client.id_client);
      expect(found).toBeDefined();
      expect(found!.legal_name).toBe(client.legal_name);
    });

    it('should return an array', async () => {
      const list = await repository.listClients();
      expect(Array.isArray(list)).toBe(true);
    });
  });
});
