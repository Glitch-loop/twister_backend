import { Injectable } from '@nestjs/common';
import { ClientRepository } from 'src/core/Interfaces/ClientRepository';
import { SupabaseDataSource } from 'src/infrastructure/datasources/SupabaseDataSource';

@Injectable()
export class ClientSupabase implements ClientRepository {
  constructor(private readonly supabaseDataSource: SupabaseDataSource) {}

  private get supabase() {
    return this.supabaseDataSource.getClient();
  }

  
}