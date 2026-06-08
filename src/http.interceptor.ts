// Library
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { Request } from 'express';

// Controllers
import { httpControllerResponse } from '@/src/shared/presentation/http/interfaces/controller-response.interface';

// Utils
import { httpFormatter } from '@/src/shared/presentation/http/handlers/http-formatter.handler';

// Intergace
import { httpResponseLoginInterface } from '@/src/shared/presentation/http/interfaces/http-response-login.interface';
import { isHttpResponseLogin } from '@/src/shared/presentation/guards/http-response-login.interface.guard';
import { UserTokenManager } from './security/core/entities/UserTokenManager';

@Injectable()
export class HttpInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const httpResponse = new httpFormatter();
    const req = context.switchToHttp().getRequest<Request>();

    const isLoginRoute = req.originalUrl === '/security/login';

    if (!isLoginRoute) {
      const authHeaderValue = req.get('authorization');

      if (!authHeaderValue || !authHeaderValue.startsWith('Bearer ')) {
        throw new UnauthorizedException('Missing bearer token');
      }

      const token = authHeaderValue.slice(7).trim();
      const tokenManager = new UserTokenManager(null, null, null);

      if (!tokenManager.isTokenValid(token)) {
        throw new UnauthorizedException('Invalid token');
      }
    }

    return next
      .handle()
      .pipe(
        map(((value: httpControllerResponse|httpResponseLoginInterface) => {
          console.log(value)

          if (isHttpResponseLogin(value)) {
            return value
          } else {
            const { message, data, meta } = value;
  
            if('message' in value) httpResponse.addMessage(message);
            if('data' in value) httpResponse.addData(data);
            if('meta' in value) httpResponse.addPaginationMetaData(meta);
  
            return httpResponse.getResponse();
          }
        }))
      );
  }
}