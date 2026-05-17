// Libraries
import { Module } from '@nestjs/common';

// Interfaces
import { IntegrityRepository } from '@/src/shared/core/interfaces/integrity.repository';

// Repositories
import { IntegrityNodeRepository } from '@/src/shared/infrastructure/repositories/node/integrity.repository';

@Module({
  controllers: [],
  providers: [
    {
      provide: IntegrityRepository,
      useClass: IntegrityNodeRepository,
    }
  ],
  exports: [IntegrityRepository],
})

export class SharedModule {}