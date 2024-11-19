import { Module } from '@nestjs/common';
import { RedisModule as RedisCoreModule } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';
import { GoogleMapsService } from './googlemaps.service';

@Module({
  imports: [
    RedisCoreModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'single',
        url: configService.get('REDIS_URL'),
        options: {
          username: configService.get('REDIS_USERNAME'),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
    }),
  ],
  providers: [GoogleMapsService],
  exports: [GoogleMapsService],
})
export class GoogleMapsModule {}
