import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const messageResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception.message || 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: typeof messageResponse === 'object' && messageResponse !== null
        ? (messageResponse as any).message || messageResponse
        : messageResponse,
      error: typeof messageResponse === 'object' && messageResponse !== null
        ? (messageResponse as any).error || undefined
        : undefined,
    };

    response.status(status).json(errorResponse);
  }
}
