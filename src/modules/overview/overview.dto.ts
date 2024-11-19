import { Appointment } from 'src/modules/appointments/entities';

export class ServiceProviderOverviewDto {
  totalBookings: number;
  totalCustomers: number;
  averageRating: number;
  cashFlow: number;
  upcomingAppointments: Appointment[];
}
