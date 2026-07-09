// Libraries
import { Controller, Sse } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// Streams
import { OnEvent } from '@nestjs/event-emitter';
import { Subject, map, Observable, merge } from 'rxjs';

// Shared
import { DOMAIN_EVENT_ENUM } from '@/src/shared/core/enums/domain-event.enum';

@ApiTags('Business Operation Route Streams')
@Controller('business-operation-route')
export class BusinessOperationRouteStreamController {
  private readonly businessOperation$ = new Subject<unknown>();
  private readonly inventoryOperation$ = new Subject<unknown>();
  private readonly registerTransaction$ = new Subject<unknown>();
  private readonly cancelTransaction$ = new Subject<unknown>();

  @Sse('stream/manager')
  sse(): Observable<MessageEvent> {
    return merge(
      this.businessOperation$.asObservable().pipe(
        map((payload) => {
          return {
            source: DOMAIN_EVENT_ENUM.BUSINESS_OPERATION_EVENT,
            payload,
          };
        }),
      ),
      this.inventoryOperation$.asObservable().pipe(
        map((payload) => {
          return {
            source: DOMAIN_EVENT_ENUM.INVENTORY_OPERATION_EVENT,
            payload,
          };
        }),
      ),
      this.registerTransaction$.asObservable().pipe(
        map((payload) => {
          return {
            source: DOMAIN_EVENT_ENUM.CREATE_TRANSACTION_OPERATION_EVENT,
            payload,
          };
        }),
      ),
      this.cancelTransaction$.asObservable().pipe(
        map((payload) => {
          return {
            source: DOMAIN_EVENT_ENUM.CREATE_TRANSACTION_OPERATION_EVENT,
            payload,
          };
        }),
      ),
    ).pipe(map((eventPayload) => ({ data: eventPayload } as MessageEvent)))
  }

  @OnEvent(DOMAIN_EVENT_ENUM.BUSINESS_OPERATION_EVENT, { async: true })
  handleBusinessOperationEvent(payload: unknown): void {
    this.businessOperation$.next(payload);
  }

  @OnEvent(DOMAIN_EVENT_ENUM.INVENTORY_OPERATION_EVENT, { async: true })
  handleInventoryOperationEvent(payload: unknown): void {
    this.inventoryOperation$.next(payload);
  }

  @OnEvent(DOMAIN_EVENT_ENUM.CREATE_TRANSACTION_OPERATION_EVENT, { async: true })
  handleRegisterTransactionOperationEvent(payload: unknown): void {
    this.registerTransaction$.next(payload);
  }
  @OnEvent(DOMAIN_EVENT_ENUM.CANCEL_TRANSACTION_OPERATION_EVENT, { async: true })
  handleCancelTransactionOperationEvent(payload: unknown): void {
    this.cancelTransaction$.next(payload);
  }
}