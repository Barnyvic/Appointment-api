import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/shared/mail/mail.service';
import { Repository } from 'typeorm';
import { NotificationChannels, NotificationType } from '../../interfaces';
import { TermiiService } from '../../shared/lib';
import { UsersRepository } from '../users/user.repository';
import { DateHelper, ErrorHelper, OtpHelper, PhoneNumberHelper, Utils } from '../../utils';
import { SendOtpDTO, VerifyOtpDto } from './dto';
import { Otp } from './otp.entity';
import { getMessage } from '../notifications/notification.messages';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp) private readonly otpRepository: Repository<Otp>,
    private readonly termiiService: TermiiService,
    private userRepository: UsersRepository,
    private mailService: MailService
  ) {}

  async send(data: SendOtpDTO) {
    const code = OtpHelper.generateOTP(4);

    let userIdentifier: string;

    if (data.channel === NotificationChannels.EMAIL) {
      userIdentifier = Utils.isEmailOrFail(data.userIdentifier);
    } else {
      userIdentifier = PhoneNumberHelper.formatToCountryStandard(data.userIdentifier);
    }

    const userExist = await this.userRepository.findByEmailOrPhoneNumber(userIdentifier);

    const { type } = data;

    if (type === NotificationType.RESET_PASSWORD) {
      if (!userExist) {
        ErrorHelper.BadRequestException('User not found');
      }
    }

    if (userExist && [NotificationType.ONBOARDING, NotificationType.VERIFY_EMAIL].includes(type)) {
      if (userExist.emailVerified) {
        ErrorHelper.BadRequestException('User already exist');
      }
    }

    const payload = {
      userIdentifier,
      expirationDate: DateHelper.addToCurrent({
        minutes: 10,
      }),
      type,
      code,
    };
    await this.otpRepository.save(payload);

    const otpChannel =
      type === NotificationType.VERIFY_EMAIL ? NotificationChannels.EMAIL : data.channel;

    await this.sendOtp(otpChannel, { code, userIdentifier, type });

    return {
      success: true,
    };
  }

  async verify(data: VerifyOtpDto): Promise<Otp> {
    const { code, type } = data;
    let userIdentifier: string;

    if (Utils.isEmail(data.userIdentifier)) {
      userIdentifier = Utils.isEmailOrFail(data.userIdentifier);
    } else {
      userIdentifier = PhoneNumberHelper.formatToCountryStandard(data.userIdentifier);
    }

    const query = {
      code,
      userIdentifier,
      type,
      isUsed: false,
    };

    const otp = await this.otpRepository.findOne({
      where: query,
    });

    if (!otp) {
      ErrorHelper.ForbiddenException('OTP incorrect');
    }

    if (DateHelper.isAfterCurrent(otp.expirationDate)) {
      ErrorHelper.ForbiddenException('OTP expired');
    }

    otp.isUsed = true;
    const updatedOtp = this.otpRepository.save(otp);

    if ([NotificationType.ONBOARDING, NotificationType.VERIFY_EMAIL].includes(type)) {
      const user = await this.userRepository.findOne({
        where: { emailAddress: data.userIdentifier },
      });

      user.emailVerified = true;

      await this.userRepository.save(user);
    }

    return updatedOtp;
  }

  private async sendOtp(
    channel: NotificationChannels,
    metadata: {
      code: string;
      userIdentifier: string;
      type: NotificationType;
    }
  ) {
    switch (channel) {
      case NotificationChannels.SMS:
        await this.termiiService.sendMessage({
          userIdentifier: metadata.userIdentifier,
          message: getMessage(metadata.type, {
            trackingCode: metadata.code,
          }).content,
        });
        break;
      case NotificationChannels.EMAIL:
        await this.mailService.sendOTPEmail(metadata);
        return;
      case NotificationChannels.WHATSAPP:
        Logger.log(`${channel}-WhatsApp-${metadata.code}`);
        return;
      case NotificationChannels.CALL:
        Logger.log(`${channel}-Call-${metadata.code}`);
        return;
      default:
        ErrorHelper.BadRequestException('Invalid OTP channel');
    }
  }
}
