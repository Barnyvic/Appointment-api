import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export class PasswordHelper {
  static hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  static comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  static generatePassword(length = 12): string {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(charset.length);
      password += charset[randomIndex];
    }
    return password;
  }
}
