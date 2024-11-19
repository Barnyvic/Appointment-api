import { Injectable, PipeTransform } from '@nestjs/common';
import { ErrorHelper } from '../utils';

@Injectable()
export class ParseFile implements PipeTransform {
  transform(
    files: Express.Multer.File | Express.Multer.File[]
  ): Express.Multer.File | Express.Multer.File[] {
    if (files === undefined || files === null) {
      ErrorHelper.BadRequestException('Validation failed (file expected)');
    }

    if (Array.isArray(files) && files.length === 0) {
      ErrorHelper.BadRequestException('Validation failed (files expected)');
    }

    return files;
  }
}
