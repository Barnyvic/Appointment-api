import { Controller, Get, Post, Body, Param, UseGuards, Query, Patch } from '@nestjs/common';
import { AppointmentsService } from './service/appointments.service';
import { HttpResponse } from 'src/utils';
import { Roles, User } from 'src/decorators';
import { IUser } from 'src/interfaces';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { AuthGuard } from 'src/guards';
import { AvailabilityService } from './service/availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';
import { RolesGuard } from 'src/guards/role.guard';
import { AppointmentStatus } from './enum/appointmnet-status.enum';
import { CancelAppointmentDto } from './dto/cancel-appoointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly availabilityService: AvailabilityService
  ) {}

  @Post('/availability/:businessId')
  @Roles(['SERVICE_PROVIDER', 'STAFF'])
  @UseGuards(RolesGuard)
  async createAvailability(
    @Param('businessId') businessId: string,
    @Body() createAvailabilityDto: CreateAvailabilityDto,
    @User() user: IUser
  ) {
    const data = await this.availabilityService.createAvailability(
      businessId,
      user.id,
      createAvailabilityDto
    );

    return HttpResponse.success({
      data,
      message: 'availability created  successfully',
    });
  }

  @Get('availability/:businessId/:serviceId')
  @UseGuards(AuthGuard)
  async getAvailability(
    @Param('businessId') businessId: string,
    @Param('serviceId') serviceId: string,
    @Query('date') date: string
  ) {
    const data = await this.availabilityService.getAvailabilitySlots(businessId, date, serviceId);

    return HttpResponse.success({
      data,
      message: 'available time retrieved successfully',
    });
  }

  @Patch('/update-availability/:availabilityId')
  @Roles(['SERVICE_PROVIDER'])
  @UseGuards(RolesGuard)
  async updateAvailability(
    @Param('availabilityId') availabilityId: string,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto
  ) {
    const data = await this.availabilityService.updateAvailability(
      availabilityId,
      updateAvailabilityDto
    );

    return HttpResponse.success({
      data,
      message: 'available time updated successfully',
    });
  }

  @Post('book-appointment/:businessId/:serviceId')
  @UseGuards(AuthGuard)
  async bookAppointment(
    @Param('businessId') businessId: string,
    @Param('serviceId') serviceId: string,
    @Body() bookAppointmentDto: BookAppointmentDto,
    @User() user: IUser,
    @Query('staffId') staffId?: string
  ) {
    const data = await this.appointmentsService.bookAppointment(
      businessId,
      user.id,
      serviceId,
      bookAppointmentDto,
      staffId
    );
    return HttpResponse.success({
      data,
      message: 'appointment booked successfully',
    });
  }

  @Patch('request-reschedule/:appointmentId')
  @Roles(['SERVICE_PROVIDER', 'STAFF'])
  @UseGuards(RolesGuard)
  async requestReschedule(
    @Param('appointmentId') appointmentId: string,
    @Body('message') message: string,
    @Query('staffId') staffId?: string
  ) {
    const data = await this.appointmentsService.requestReschedule(appointmentId, message, staffId);

    return HttpResponse.success({
      data,
      message: 'Reschedule request sent successfully',
    });
  }

  @Patch('reschedule-appointment/:appointmentId')
  @UseGuards(AuthGuard)
  async rescheduleAppointment(
    @Param('appointmentId') appointmentId: string,
    @Body() rescheduleAppointmentDto: RescheduleAppointmentDto,
    @User() user: IUser
  ) {
    const data = await this.appointmentsService.customerReschedule(
      user.id,
      appointmentId,
      rescheduleAppointmentDto
    );

    return HttpResponse.success({
      data,
      message: 'Appointment rescheduled successfully',
    });
  }

  @Patch('cancel-appointment/:appointmentId')
  @UseGuards(AuthGuard)
  async cancelAppointment(
    @User() user: IUser,
    @Param('appointmentId') appointmentId: string,
    @Body() cancelAppointmentDto: CancelAppointmentDto
  ) {
    const data = await this.appointmentsService.cancelAppointment(
      user.id,
      appointmentId,
      cancelAppointmentDto
    );

    return HttpResponse.success({
      data,
      message: 'appointment cancelled successfully',
    });
  }

  @Get('customer-appointments')
  @UseGuards(AuthGuard)
  async getCustomerAppointments(@User() user: IUser) {
    const data = await this.appointmentsService.getCustomerAppointments(user.id);

    return HttpResponse.success({
      data,
      message: 'user appointment retrieved  successfully',
    });
  }

  @Patch('confirm/:appointmentId')
  @Roles(['SERVICE_PROVIDER'])
  @UseGuards(AuthGuard, RolesGuard)
  async confirmAppointment(@Param('appointmentId') appointmentId: string, @User() user: IUser) {
    const data = await this.appointmentsService.confirmAppointment(appointmentId, user.id);
    return HttpResponse.success({
      data,
      message: 'Appointment confirmed successfully',
    });
  }

  @Patch('status/:appointmentId')
  @UseGuards(AuthGuard)
  async updateAppointmentStatus(
    @Param('appointmentId') appointmentId: string,
    @Query('status') status: AppointmentStatus
  ) {
    const data = await this.appointmentsService.updateAppointmentStatus(appointmentId, status);
    return HttpResponse.success({
      data,
      message: 'Appointment status updated successfully',
    });
  }
}
