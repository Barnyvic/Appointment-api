import { IsString } from 'class-validator';
import { NotificationType } from '../../../interfaces';

export class VerifyOtpDto {
  @IsString()
  userIdentifier: string;

  @IsString()
  code: string;

  @IsString()
  type: NotificationType;
}
