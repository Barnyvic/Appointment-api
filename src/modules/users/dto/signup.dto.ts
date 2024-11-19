import { IsOptional, IsString } from 'class-validator';
import { RegisterUserDto } from './register-user.dto';

export class CreateAuthDto extends RegisterUserDto {
  referralCode: string;

  otpCode: string;
}
