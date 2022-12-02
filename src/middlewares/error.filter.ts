import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { FailedResult } from '@others';
import { Response } from 'express';

// @Catch(HttpException) 表示只catch http异常 下面表示catch所有
@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const message = exception.message || 'Something went wrong';

    response.status(status).json(new FailedResult(exception, message));
  }
}
