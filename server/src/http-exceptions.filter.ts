import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const messages = [];

    if (typeof exception.getResponse() === 'string') {
      messages.push(exception.getResponse());
    } else {
      const expectionMessages = exception.getResponse() as {
        message: string[];
      };
      if (typeof expectionMessages.message === 'object') {
        messages.push(...expectionMessages.message);
      } else {
        messages.push(expectionMessages.message);
      }
    }

    response.status(status).json({
      messages,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
