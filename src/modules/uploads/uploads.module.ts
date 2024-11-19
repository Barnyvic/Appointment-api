import { Module } from '@nestjs/common';
import { UploadService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  imports: [ConfigModule],
  controllers: [UploadsController],
  providers: [UploadService, CloudinaryProvider, ConfigService],
})
export class UploadsModule {}
