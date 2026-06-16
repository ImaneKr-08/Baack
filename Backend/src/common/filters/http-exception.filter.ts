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
    const isDatabaseUnavailable = this.isDatabaseUnavailable(exception);
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : isDatabaseUnavailable
        ? HttpStatus.SERVICE_UNAVAILABLE
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (!(exception instanceof HttpException)) {
      console.error(exception);
    }

    const messageResponse = exception instanceof HttpException
      ? exception.getResponse()
      : isDatabaseUnavailable
        ? 'Database connection unavailable. Please try again shortly.'
        : 'Internal server error';

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

  private isDatabaseUnavailable(exception: any) {
    const message = [
      exception?.message,
      exception?.cause?.message,
      exception?.meta?.message,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return (
      message.includes('pool timeout') ||
      message.includes('failed to retrieve a connection') ||
      message.includes('can\'t reach database server') ||
      message.includes('connection refused') ||
      message.includes('connect etimedout')
    );
  }
}
