import { Module } from '@nestjs/common';

import { SecurityController } from '@/src/security/security.controller';

@Module({
  imports: [],
  controllers: [SecurityController],
  providers: [],
})
export class SecurityModule {}
