import {
  BadRequestException,
  PayloadTooLargeException,
} from '@nestjs/common';
import {
  FILE_REQUIRED_MESSAGE,
  FILE_TOO_LARGE_MESSAGE,
  INVALID_PDF_MESSAGE,
  MAX_FILE_SIZE_BYTES,
  ONLY_PDF_ALLOWED_MESSAGE,
  PDF_MAGIC_BYTES,
  PDF_MIME_TYPE,
} from '../constants';

export function assertPdfUpload(file: Express.Multer.File | undefined): Express.Multer.File {
  if (!file) {
    throw new BadRequestException(FILE_REQUIRED_MESSAGE);
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new PayloadTooLargeException(FILE_TOO_LARGE_MESSAGE);
  }

  const mime = file.mimetype?.toLowerCase();
  if (mime !== PDF_MIME_TYPE) {
    throw new BadRequestException(ONLY_PDF_ALLOWED_MESSAGE);
  }

  if (!file.buffer?.subarray(0, 4).equals(PDF_MAGIC_BYTES)) {
    throw new BadRequestException(INVALID_PDF_MESSAGE);
  }

  return file;
}
