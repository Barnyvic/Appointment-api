import { Client } from '@googlemaps/google-maps-services-js';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { GeoCoordinates } from 'src/interfaces';

@Injectable()
export class GoogleMapsService extends Client {
  private readonly accessKey = this.config.get('GOOGLE_MAPS_ACCESS_KEY');

  private logger = new Logger('GoogleMapsService');

  constructor(private config: ConfigService, @InjectRedis() private redisClient: Redis) {
    super();
  }

  async getCoordinates(address: string): Promise<GeoCoordinates> {
    const requestHash = this.hashData({ address, fn: 'getCoordinates' });

    const cachedData = await this.cacheWrapper<any>(requestHash, 60 * 60 * 24, async () => {
      const googleRes = await this.geocode({
        params: {
          address,
          key: this.accessKey,
        },
      });

      if (!googleRes.data.results[0]?.geometry?.location) return { longitude: 0, latitude: 0 };

      // eslint-disable-next-line no-unsafe-optional-chaining
      const { lng, lat } = googleRes.data.results[0]?.geometry?.location;

      return { longitude: lng || 0, latitude: lat || 0 };
    });

    return cachedData;
  }

  async getAddress(latitude: number, longitude: number): Promise<any> {
    const requestHash = this.hashData({ latitude, longitude, fn: 'getAddress' });

    const cachedData = await this.cacheWrapper<any>(requestHash, 60 * 60 * 24, async () => {
      const googleRes = await this.reverseGeocode({
        params: {
          latlng: `${latitude},${longitude}`,
          key: this.accessKey,
        },
      });

      return googleRes.data.results[0].formatted_address;
    });

    return cachedData;
  }

  private hashData(data: any) {
    const stringifyData = JSON.stringify(data);

    const hash = createHash('sha256');

    hash.update(stringifyData);

    return hash.digest('hex');
  }

  private async cacheWrapper<T>(key: string, ttl: number, fn: () => Promise<T>): Promise<T> {
    const cachedData = await this.redisClient.get(key);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const data = await fn();

    await this.redisClient.set(key, JSON.stringify(data), 'EX', ttl);

    return data;
  }
}
