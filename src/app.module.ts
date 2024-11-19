import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envVarsSchema } from './helpers';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from './base/constants';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters';
import { OtpModule } from './modules/otp/otp.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { BusinessModule } from './modules/business/business.module';
import { GoogleMapsModule } from './modules/googlemaps/googlemaps.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { CashflowModule } from './modules/cashflow/cashflow.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { StaffsModule } from './modules/staffs/staffs.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { OverViewModule } from './modules/overview/overview.module';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from './modules/workers/workers.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FirebaseModule } from './shared/firebase/firebase.module';
import { AnnouncementModule } from './modules/announcement/announcement.module';
import { SquadModule } from './modules/paymentgateway/squad.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { FavoritesModule } from './modules/Favorite/favorite.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: envVarsSchema,
    }),
    DatabaseModule,
    UsersModule,
    GoogleMapsModule,
    {
      ...JwtModule.register({
        secret: JWT_SECRET,
        signOptions: {},
      }),
      global: true,
    },
    OtpModule,
    NestjsFormDataModule,
    BusinessModule,
    AppointmentsModule,
    ReviewsModule,
    StaffsModule,
    NotificationModule,
    OverViewModule,
    CashflowModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
          username: configService.get<string>('REDIS_USERNAME'),
        },
      }),
      inject: [ConfigService],
    }),
    SquadModule,
    BullBoardModule,
    ScheduleModule.forRoot(),
    FirebaseModule,
    AnnouncementModule,
    UploadsModule,
    FavoritesModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
