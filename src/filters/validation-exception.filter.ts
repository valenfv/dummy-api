import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionResponse = exception.getResponse() as any;

    const details: Record<string, string> = {};

    if (Array.isArray(exceptionResponse.message)) {
      exceptionResponse.message.forEach((msg: string) => {
        const parts = msg.split(' ');
        const field = parts[0];
        details[field] = 'This field is required';
      });
    } else if (typeof exceptionResponse.message === 'string') {
      details.error = exceptionResponse.message;
    }

    response.status(422).json({
      error: 'validation_error',
      details,
    });
  }
}
