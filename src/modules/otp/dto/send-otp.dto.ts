import { IsEnum, IsString } from 'class-validator';
import { NotificationChannels, NotificationType } from '../../../interfaces';

export class SendOtpDTO {
  @IsString()
  // email, phone number, etc
  userIdentifier: string;

  @IsEnum(NotificationChannels, {
    message: 'Invalid channel',
  })
  channel: NotificationChannels;

  @IsEnum(NotificationType, {
    message: 'Invalid OTP type',
  })
  type: NotificationType;
}
