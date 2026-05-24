import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { httpControllerResponse } from '@/src/shared/presentation/http/interfaces/controller-response.interface';
import { httpFormatter } from '@/src/shared/presentation/http/handlers/http-formatter.handler';
import { httpControllerResponseWithData } from './shared/presentation/http/interfaces/controller-response-with-data.interface';

@Injectable()
export class HttpInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const httpResponse = new httpFormatter();

    return next
      .handle()
      .pipe(
        map(((value: httpControllerResponse) => {
          const { message, data, meta } = value;
          console.log(value)
          if('message' in value) httpResponse.addMessage(message);
          if('data' in value) httpResponse.addData(data);
          if('meta' in value) httpResponse.addPaginationMetaData(meta);

          return httpResponse.getResponse();
        }))
      );
  }
}