import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
// import toStream = require('buffer-to-stream');
import { S3 } from 'aws-sdk';
import * as AWS from 'aws-sdk';

@Injectable()
export class AWSS3Service {
  private endpoint: any;

  constructor(private configService: ConfigService) {
    this.endpoint = new AWS.Endpoint(this.configService.get('AWS_ENDPOINT'));
  }

  async uploadImage(file: Express.Multer.File): Promise<any> {
    const s3 = new AWS.S3({
      endpoint: this.endpoint,
      accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
    });

    const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, '_');

    const params: S3.Types.PutObjectRequest = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read',
    };

    return s3.upload(params).promise();
  }
}
