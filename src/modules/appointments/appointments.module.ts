import { forwardRef, Module } from '@nestjs/common';
import { AppointmentsService } from './service/appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmExModule } from 'src/typeorm-extension';
import { AppointmentRepository } from './repository/appointments.repository';
import { BusinessModule } from '../business/business.module';
import { UsersModule } from '../users/users.module';
import { AvailabilityRepository } from './repository/availability.repository';
import { AvailabilityService } from './service/availability.service';
import { StaffsModule } from '../staffs/staffs.module';
import { NotificationModule } from '../notifications/notification.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([AppointmentRepository, AvailabilityRepository]),
    forwardRef(() => BusinessModule),
    forwardRef(() => UsersModule),
    forwardRef(() => StaffsModule),
    forwardRef(() => NotificationModule),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AvailabilityService],
  exports: [AppointmentsService, AvailabilityService],
})
export class AppointmentsModule {}
