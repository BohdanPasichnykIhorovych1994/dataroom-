import { memoryStorage } from 'multer';
import { MAX_FILE_SIZE_BYTES } from '../constants';

export const pdfUploadMulterOptions = {
  storage: memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
};
