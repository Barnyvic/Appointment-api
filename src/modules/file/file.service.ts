import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { AWSS3Service } from './aws-s3/aws-s3.service';

@Injectable()
export class FileService {
  private s3Provider: string;

  constructor(
    private configService: ConfigService,
    private cloudinaryService: CloudinaryService,
    private awsS3Service: AWSS3Service
  ) {
    this.s3Provider = this.configService.get('S3_PROVIDER');
  }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string }> {
    let link = '';

    switch (this.s3Provider) {
      case 'AWS_S3': {
        const url = await this.aws_S3(file);
        link = url;
        break;
      }
      case 'CLOUDINARY': {
        const url = await this.cloudinary(file);
        link = url;
        break;
      }
      default: {
        if (!link) {
          throw new Error('File upload failed: Check config');
        }
        break;
      }
    }

    return {
      url: link,
    };
  }

  async uploadFiles(files: Array<Express.Multer.File>): Promise<{ urls: string[] }> {
    const links: string[] = await Promise.all(
      files.map(async file => {
        const { url } = await this.uploadFile(file);
        return url;
      })
    );

    return {
      urls: links,
    };
  }

  private async aws_S3(file: Express.Multer.File): Promise<string> {
    const result = await this.awsS3Service.uploadImage(file);

    return result.Location;
  }

  private async cloudinary(file: Express.Multer.File): Promise<string> {
    const result = await this.cloudinaryService.uploadImage(file);

    return result.secure_url;
  }
}
