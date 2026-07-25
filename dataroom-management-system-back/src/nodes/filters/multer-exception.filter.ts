import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { MulterError } from 'multer';
import {
  FILE_TOO_LARGE_MESSAGE,
  UPLOAD_FAILED_MESSAGE,
} from '../constants';

@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    if (exception.code === 'LIMIT_FILE_SIZE') {
      res.status(HttpStatus.PAYLOAD_TOO_LARGE).json({
        statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
        message: FILE_TOO_LARGE_MESSAGE,
      });
      return;
    }

    res.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: exception.message || UPLOAD_FAILED_MESSAGE,
    });
  }
}
