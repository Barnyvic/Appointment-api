import { IsNotEmpty, IsString } from 'class-validator';
import { Match } from '../../../decorators';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  userIdentifier: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Match<ResetPasswordDto>('password')
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
