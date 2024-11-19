import { validateOrReject } from 'class-validator';
import * as util from 'util';
import { Point } from 'geojson';
import * as isemail from 'isemail';
import { ErrorHelper } from './error.utils';

export class Utils {
  static isEmailOrFail(email: string) {
    const valid = isemail.validate(email);

    if (!valid) {
      ErrorHelper.BadRequestException('Invalid email');
    }

    return email;
  }

  static isEmail(email: string) {
    return isemail.validate(email);
  }

  static createLocation(location: { latitude: number; longitude: number }): Point {
    return {
      type: 'Point',
      coordinates: [location.longitude, location.latitude],
    };
  }

  static async validateObject(Schema: any, data: object) {
    const object = Object.assign(new Schema(), data);

    try {
      await validateOrReject(object, { validationError: { target: false } });
      return object;
    } catch (errors) {
      const error = Object.values(errors[0]?.constraints)[0] as string;
      throw new Error(error || 'validation error');
    }
  }

  static formatString(format: string, ...values: any[]): string {
    return util.format(format, ...values);
  }

  static removeEmptyFields(obj: any) {
    const newObj = {};
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (value !== '' && value !== null && value !== undefined) {
        newObj[key] = value;
      }
    });
    return newObj;
  }

  static calculateDistance(
    location1: {
      latitude: number;
      longitude: number;
    },
    location2: {
      latitude: number;
      longitude: number;
    }
  ) {
    const R = 6371; // Earth's radius in km
    const lat1 = location1.latitude;
    const lon1 = location1.longitude;
    const lat2 = location2.latitude;
    const lon2 = location2.longitude;

    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // distance in km

    return distance;
  }

  static deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }
}
