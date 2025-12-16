import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse, ErrorResponse } from 'src/utils/response-wrapper.utils';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code: string | undefined;

    // Обработка HttpException (NotFoundException, BadRequestException и т.д.)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const response = exceptionResponse as ErrorResponse;

        if (Array.isArray(response.message)) {
          message = response.message.join(', ');
        } else {
          message = response.message || message;
        }

        code = response.code;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse: ApiResponse<void> = {
      data: null,
      successful: false,
      error: {
        message,
        statusCode: status,
        code,
      },
    };

    response.status(status).json(errorResponse);
  }
}
