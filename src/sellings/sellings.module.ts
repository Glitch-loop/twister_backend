import { Module } from '@nestjs/common';

import { SellingsController } from '@/src/sellings/sellings.controller';

@Module({
  controllers: [SellingsController],
  providers: [],
})
export class SellingsModule {}
