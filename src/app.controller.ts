import { Controller, Get } from '@nestjs/common';

import { CreateRouteCommand } from '@/src/route-organization/application/commands/create-route.command';

@Controller('routes')
export class AppController {
  constructor(
    private readonly createRouteCommand: CreateRouteCommand, 
  ) {}

  @Post('')
  async createRoute() {

  }

}
