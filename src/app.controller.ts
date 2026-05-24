import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  constructor() {}

  @Get()
  helloWorld() {
    return 'Hello world'
  }
}
