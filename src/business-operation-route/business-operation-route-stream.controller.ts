// Libraries
import { 
	Body, 
	Controller, 
	Get, 
	Param, 
	Patch, 
	Post, 
	Query,
	Sse
} from '@nestjs/common';

import {
	ApiBody,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTags,
} from '@nestjs/swagger';

// Streams
import { OnEvent } from '@nestjs/event-emitter';
import { Subject, map, Observable } from 'rxjs';



@ApiTags('Business Operation Route')
@Controller('business-operation-route')
export class BusinessOperationRouteStreamController {
    // 1. Create an internal RxJS Subject to stream your data
    private readonly businessOperation$ = new Subject<any>();
  
    // 2. The SSE Endpoint: Runs ONCE when a client connects
    @Sse('stream')
    sse(): Observable<MessageEvent> {
      // Return the subject as an observable. 
      // Format the data into the structure SSE expects ({ data: ... })
      return this.businessOperation$.asObservable().pipe(
        map((payload) => ({ data: payload } as MessageEvent))
      );
    }
    
  // 3. The Event Listener: Fires every time the domain event is emitted
    @OnEvent('route-business-operation.register', { async: true })
    handleOrderCreatedEvent(payload: any) {    
      // Push the event payload directly into the RxJS stream
      this.businessOperation$.next(payload);
    }
  
}