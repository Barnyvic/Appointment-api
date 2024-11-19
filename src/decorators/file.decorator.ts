import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { fileMimetypeFilter } from '../filters';

export function ApiFile(fieldName = 'file', localOptions?: MulterOptions) {
  return applyDecorators(UseInterceptors(FileInterceptor(fieldName, localOptions)));
}

export function ApiImageFile(fileName = 'image') {
  return ApiFile(fileName, {
    fileFilter: fileMimetypeFilter('image'),
  });
}

export function ApiPdfFile(fileName = 'document') {
  return ApiFile(fileName, {
    fileFilter: fileMimetypeFilter('pdf'),
  });
}
