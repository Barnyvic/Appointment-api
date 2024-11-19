import * as OtpGenerator from 'otp-generator';

export class OtpHelper {
  static generateOTP(length: number): string {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i += 1) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }

  static generatePassword(length: number) {
    return OtpGenerator.generate(length, {
      upperCaseAlphabets: true,
      specialChars: true,
      lowerCaseAlphabets: true,
      digits: true,
    });
  }

  static generateReference(length: number) {
    return OtpGenerator.generate(length, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });
  }
}
