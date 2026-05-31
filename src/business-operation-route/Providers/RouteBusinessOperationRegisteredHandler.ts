import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BusinessOperationBroker } from './BusinessOperationBroker';

@Injectable()
export class RouteBusinessOperationRegisteredHandler {
  constructor(private readonly broker: BusinessOperationBroker) {}

  @OnEvent('route-business-operation.register', { async: true })
  handle(payload: string | object): void {
    console.log("Registry")
    this.broker.publish(payload);
  }
}