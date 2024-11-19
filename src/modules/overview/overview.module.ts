import { Module } from '@nestjs/common';
import { AppointmentsModule } from '../appointments/appointments.module';
import { BusinessModule } from '../business/business.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { UsersModule } from '../users/users.module';
import { OverViewController } from './overview.controller';
import { OverViewService } from './overview.service';
import { CashflowModule } from '../cashflow/cashflow.module';

@Module({
  imports: [BusinessModule, UsersModule, ReviewsModule, AppointmentsModule, CashflowModule],
  controllers: [OverViewController],
  providers: [OverViewService],
  exports: [OverViewService],
})
export class OverViewModule {}
