import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * SupabaseDataSource - Manages Supabase connection as singleton
 * One instance shared across all repositories
 */
@Injectable()
export class SupabaseDataSource {
  private client: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Supabase credentials not found in environment variables. Expected one of: PUBLIC_SUPABASE_URL or SUPABASE_URL, and PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY.',
      );
    }

    this.client = createClient(supabaseUrl, supabaseAnonKey);
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
