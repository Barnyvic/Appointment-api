import { forwardRef, Module } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { StaffsController } from './staffs.controller';
import { TypeOrmExModule } from 'src/typeorm-extension';
import { StaffRepository } from './staff-repository';
import { BusinessModule } from '../business/business.module';
import { UsersModule } from '../users/users.module';
import { AppointmentsModule } from '../appointments/appointments.module';
import { NotificationModule } from '../notifications/notification.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([StaffRepository]),
    forwardRef(() => UsersModule),
    forwardRef(() => BusinessModule),
    forwardRef(() => AppointmentsModule),
    NotificationModule,
  ],
  controllers: [StaffsController],
  providers: [StaffsService],
  exports: [StaffsService],
})
export class StaffsModule {}
