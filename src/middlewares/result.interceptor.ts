import { PACK_RESULT_KEY } from '@decorators';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SuccessResult } from '@others';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResultInterceptor<T> implements NestInterceptor<T, SuccessResult<T>> {
  constructor(private reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessResult<T>> {
    const NotPackResult = this.reflector.getAllAndOverride<boolean>(PACK_RESULT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!NotPackResult) {
      return next.handle();
    }
    return next.handle().pipe(map((data) => new SuccessResult(data)));
  }
}
