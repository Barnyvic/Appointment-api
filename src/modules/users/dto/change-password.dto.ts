import { IsNotEmpty, IsString } from 'class-validator';
import { Match } from '../../../decorators';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @Match<ChangePasswordDto>('newPassword')
  confirmNewPassword: string;
}
