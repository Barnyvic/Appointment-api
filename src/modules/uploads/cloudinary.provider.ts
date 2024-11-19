import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { CloudinaryConstant } from './enums/cloudinary.constant';

export const CloudinaryProvider = {
  provide: CloudinaryConstant.Cloudinary,
  useFactory: (configService: ConfigService) => {
    return cloudinary.config({
      cloud_name: configService.get('CLD_CLOUD_NAME'),
      api_key: configService.get('CLD_API_KEY'),
      api_secret: configService.get('CLD_API_SECRET'),
    });
  },
  inject: [ConfigService],
};
