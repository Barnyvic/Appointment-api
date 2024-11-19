import { ErrorHelper } from './error.utils';

export class PhoneNumberHelper {
  static formatToCountryStandard(number: string) {
    // 9012345678 => 2349012345678
    if (number.startsWith('0') && number.length === 10) {
      return `234${number}`;
    }

    // 09012345678 => 2349012345678
    if (number.startsWith('0') && number.length === 11) {
      return `234${number.slice(1)}`;
    }

    // 2349012345678 => 2349012345678
    if (number.startsWith('234') && number.length === 13) {
      return number;
    }

    // 23409012345678 => 2349012345678
    if (number.startsWith('2340') && number.length === 14) {
      return `234${number.slice(4)}`;
    }

    // +2349012345678 => 2349012345678
    if (number.startsWith('+234') && number.length === 14) {
      return number.slice(1);
    }

    // +23409012345678 => 2349012345678
    if (number.startsWith('+2340') && number.length === 15) {
      return `234${number.slice(5)}`;
    }

    ErrorHelper.BadRequestException('Invalid phone number');
  }
}
