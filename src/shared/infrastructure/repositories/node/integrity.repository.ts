// Libraries
import crypto from 'crypto';

// Interfaces
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

export class IntegrityNodeRepository extends IntegrityRepository {
  generateUUIDv4(): string {
    // Generate a UUIDv4 using the crypto module
    return crypto.randomUUID();
  }
}