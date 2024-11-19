import { Injectable } from '@nestjs/common';
import { AppointmentsService } from '../appointments/service/appointments.service';
import { UsersService } from '../users/users.service';
import { ReviewsService } from '../reviews/reviews.service';
import { ServiceProviderOverviewDto } from './overview.dto';
import { CashFlowService } from '../cashflow/cashflow.service';

@Injectable()
export class OverViewService {
  constructor(
    private readonly usersService: UsersService,
    private readonly appointmentsService: AppointmentsService,
    private readonly reviewsService: ReviewsService,
    private readonly cashFlowService: CashFlowService
  ) {}

  async getOverViewDashBoardForABusiness(businessId: string): Promise<ServiceProviderOverviewDto> {
    const [totalBookings, totalCustomers, averageRating, upcomingAppointments, cashFlow] =
      await Promise.all([
        this.appointmentsService.getTotalNumberOfBookings(businessId),
        this.usersService.getTotalCustomerForABusiness(businessId),
        this.reviewsService.getAverageRatingOfABusiness(businessId),
        this.appointmentsService.getBusinessAppointmentsByStatus(businessId),
        this.cashFlowService.countTotalCashFlowForBusiness(businessId),
      ]);

    return {
      totalBookings: totalBookings,
      totalCustomers: totalCustomers,
      averageRating: averageRating,
      cashFlow: cashFlow,
      upcomingAppointments: upcomingAppointments,
    };
  }
}
