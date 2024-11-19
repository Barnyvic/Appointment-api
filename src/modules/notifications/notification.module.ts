import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TermiiService } from 'src/shared/lib';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification } from './entities/notification.entity';
import { OtpModule } from '../otp/otp.module';
import { AppointmentsModule } from '../appointments/appointments.module';
import { BullBoardModule } from '../workers/workers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    OtpModule,
    forwardRef(() => AppointmentsModule),
    forwardRef(() => BullBoardModule),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, TermiiService],
  exports: [NotificationService],
})
export class NotificationModule {}
