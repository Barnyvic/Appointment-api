import { Controller, Post, UploadedFiles, UseInterceptors, Body } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './uploads.service';
import { HttpResponse } from 'src/utils';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('fileClass') fileClass: string
  ) {
    const urls = await this.uploadService.uploadImages(files, fileClass);
    return HttpResponse.success({
      data: urls,
      message: 'Images uploaded successfully...',
    });
  }
}
