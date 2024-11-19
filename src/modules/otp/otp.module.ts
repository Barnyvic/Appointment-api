import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/shared/mail/mail.module';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { Otp } from './otp.entity';
import { UsersRepository } from '../users/user.repository';
import { TypeOrmExModule } from '../../typeorm-extension';
import { TermiiService } from '../../shared/lib';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UsersRepository]),
    TypeOrmModule.forFeature([Otp]),
    MailModule,
  ],
  controllers: [OtpController],
  providers: [OtpService, TermiiService],
})
export class OtpModule {}
