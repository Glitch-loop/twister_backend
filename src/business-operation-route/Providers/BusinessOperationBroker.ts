import { Injectable, MessageEvent } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class BusinessOperationBroker {
  private readonly stream$ = new Subject<MessageEvent>();

  publish(payload: string | object): void {
    this.stream$.next({ type: 'route-business-operation.register', data: payload });
  }

  asObservable(): Observable<MessageEvent> {
    return this.stream$.asObservable();
  }
}