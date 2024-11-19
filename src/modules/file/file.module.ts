import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AWSS3Module } from './aws-s3/aws-s3.module';

@Module({
  imports: [CloudinaryModule, AWSS3Module],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
