import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/typeorm-extension';
import { BusinessRepository } from './repository/business.repository';
import { BusinessService } from './services/business.service';
import { GoogleMapsModule } from '../googlemaps/googlemaps.module';
import { ServiceDetailsRepository } from './repository/serviceDetails.repository';
import { ServiceDetailsService } from './services/serviceDetails.service';
import { BusinessController } from './controllers/business.controller';
import { AppointmentsModule } from '../appointments/appointments.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { UsersModule } from '../users/users.module';
import { UsersRepository } from '../users/user.repository';
import { NotificationModule } from '../notifications/notification.module';
import { BookingHoursRepository } from './repository/businessHour.repository';
import { BookingHoursService } from './services/business.bookingHours.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      BusinessRepository,
      ServiceDetailsRepository,
      UsersRepository,
      BookingHoursRepository,
    ]),
    GoogleMapsModule,
    AppointmentsModule,
    ReviewsModule,
    forwardRef(() => UsersModule),
    NotificationModule,
  ],
  providers: [BusinessService, ServiceDetailsService, BookingHoursService],
  controllers: [BusinessController],
  exports: [BusinessService, ServiceDetailsService],
})
export class BusinessModule {}
