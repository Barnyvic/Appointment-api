import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiFile } from '../../decorators/file.decorator';
import { AuthGuard } from '../../guards';
import { ParseFile } from '../../pipes';
import { HttpResponse } from '../../utils';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly filesService: FileService) {}

  @Post('upload')
  @ApiFile('file')
  @UseGuards(AuthGuard)
  async uploadFile(@UploadedFile(ParseFile) file: Express.Multer.File) {
    const data = await this.filesService.uploadFile(file);

    return HttpResponse.success({ data, message: 'file uploaded successfully' });
  }

  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard)
  async uploadFiles(@UploadedFiles(ParseFile) files: Array<Express.Multer.File>) {
    const data = await this.filesService.uploadFiles(files);

    return HttpResponse.success({ data, message: 'files uploaded successfully' });
  }
}
