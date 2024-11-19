import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AppointmentRepository } from '../repository/appointments.repository';
import { UsersService } from '../../users/users.service';
import { ErrorHelper } from 'src/utils';
import { BookAppointmentDto } from '../dto/book-appointment.dto';
import { RescheduleAppointmentDto } from '../dto/reschedule-appointment.dto';
import { Appointment } from '../entities';
import { StaffsService } from 'src/modules/staffs/staffs.service';
import { AppointmentStatus } from '../enum/appointmnet-status.enum';
import { BusinessService } from 'src/modules/business/services/business.service';
import { NotificationService } from 'src/modules/notifications/notification.service';
import { NotificationType } from 'src/interfaces';
import { Role } from 'src/modules/users/enum';
import { CancelAppointmentDto } from '../dto/cancel-appoointment.dto';
import { PaginationDto, PaginationResultDto } from 'src/queries/dto';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly staffsService: StaffsService,
    @Inject(forwardRef(() => BusinessService))
    private readonly businessService: BusinessService,
    private readonly notificationService: NotificationService
  ) {}

  //TODO: send notification to the user about the appointment and also the business service and staff
  async bookAppointment(
    businessId: string,
    userId: string | null,
    serviceId: string,
    bookAppointmentDto: BookAppointmentDto,
    staffId?: string
  ) {
    const { date, startTime, customerName, customerEmail, customerPhoneNumber } =
      bookAppointmentDto;

    const appointmentDate = new Date(`${date}T${startTime}:00.000Z`);
    const currentDate = new Date();

    if (appointmentDate < currentDate) {
      ErrorHelper.BadRequestException('Cannot book an appointment in the past.');
    }

    const business = await this.businessService.findBusiness(businessId);
    if (!business) {
      ErrorHelper.BadRequestException('Business not found');
    }

    const serviceDetails = business.services.find(service => service.id === serviceId);
    if (!serviceDetails) {
      ErrorHelper.BadRequestException('Service details not found');
    }

    const interval = this.calculateInterval(serviceDetails);

    const bookingHours = this.getBookingHoursForDay(business.bookingHours, appointmentDate);
    if (!bookingHours) {
      ErrorHelper.BadRequestException('No booking hours found for the given date');
    }

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const endDate = new Date(appointmentDate);
    endDate.setUTCHours(startHour);
    endDate.setUTCMinutes(startMinute + interval);

    const endTime = `${endDate.getUTCHours().toString().padStart(2, '0')}:${endDate
      .getUTCMinutes()
      .toString()
      .padStart(2, '0')}`;

    const existingAppointment = await this.appointmentRepository.findOneAppointment(
      businessId,
      appointmentDate,
      startTime,
      endTime
    );

    if (existingAppointment) {
      ErrorHelper.BadRequestException('This time slot is already booked');
    }

    let existingUser = null;
    if (userId) {
      existingUser = await this.usersService.getUserById(userId);
      if (existingUser.role !== Role.USER) {
        existingUser = null;
      }
    } else if (customerEmail) {
      existingUser = await this.usersService.findUserByEmail(customerEmail);
      if (existingUser && existingUser.role === Role.USER) {
        userId = existingUser.id;
      } else {
        existingUser = null;
      }
    }

    let staff = null;
    if (staffId) {
      staff = await this.staffsService.findOne(staffId);
      if (!staff) {
        ErrorHelper.BadRequestException('Staff not found');
      }
    }

    const appointment = await this.appointmentRepository.createAppointment(
      business,
      serviceDetails,
      bookAppointmentDto,
      endTime,
      existingUser,
      staff
    );

    // Send notifications
    if (existingUser) {
      const notificationData = {
        userId: existingUser.id,
        type: NotificationType.BOOKED_APPOINTMENT,
        metadata: {
          appointmentId: appointment.id,
          date: appointmentDate,
          startTime: startTime,
          endTime: endTime,
          businessName: business.businessName,
          serviceName: serviceDetails.serviceName,
        },
      };
      await this.notificationService.queueNotification(notificationData);
    } else {
      const notificationData = {
        userId: business.owner.id,
        type: NotificationType.BOOKED_APPOINTMENT,
        metadata: {
          appointmentId: appointment.id,
          date: appointmentDate,
          startTime: startTime,
          endTime: endTime,
          businessName: business.businessName,
          serviceName: serviceDetails.serviceName,
          customerName: customerName,
          customerEmail: customerEmail,
          customerPhoneNumber: customerPhoneNumber,
        },
      };
      await this.notificationService.queueNotification(notificationData);
    }

    return appointment;
  }
  //TODO: send notification to the user about rescheduled  appointment and also the business service and staff

  async requestReschedule(appointmentId: string, message: string, staffId?: string) {
    const appointment = await this.appointmentRepository.findOneById(appointmentId);
    if (!appointment) {
      ErrorHelper.NotFoundException('Appointment not found');
    }

    const business = await this.businessService.findBusiness(appointment.businessProfile.id);
    if (!business) {
      ErrorHelper.BadRequestException('Business not found');
    }

    appointment.rescheduleRequested = true;
    appointment.rescheduleMessage = message;
    appointment.status = AppointmentStatus.PENDING;

    if (staffId) {
      const staff = await this.staffsService.findOne(staffId);
      if (!staff) {
        ErrorHelper.BadRequestException('Staff not found');
      }
      appointment.assignedStaff = staff;
    }

    await this.appointmentRepository.saveAppointment(appointment);

    // Send notification to customer
    await this.notificationService.createNotification({
      userId: appointment.customer.id,
      type: NotificationType.RESCHEDULE_REQUESTED,
      metadata: {
        appointmentId: appointment.id,
        businessName: business.businessName,
        message: message,
      },
    });

    return appointment;
  }

  async customerReschedule(
    userId: string,
    appointmentId: string,
    rescheduleAppointmentDto: RescheduleAppointmentDto
  ) {
    const { newDate, newStartTime } = rescheduleAppointmentDto;

    const appointment = await this.appointmentRepository.findOneById(appointmentId);
    if (!appointment) {
      ErrorHelper.NotFoundException('Appointment not found');
    }

    if (appointment.customer.id !== userId) {
      ErrorHelper.ForbiddenException('You do not have permission to reschedule this appointment');
    }

    const newAppointmentDate = new Date(`${newDate}T${newStartTime}:00.000Z`);
    const currentDate = new Date();
    if (newAppointmentDate < currentDate) {
      ErrorHelper.BadRequestException('Cannot reschedule to a past date');
    }

    const business = await this.businessService.findBusiness(appointment.businessProfile.id);
    if (!business) {
      ErrorHelper.BadRequestException('Business not found');
    }

    const serviceDetails = business.services.find(
      service => service.id === appointment.serviceDetails.id
    );
    if (!serviceDetails) {
      ErrorHelper.BadRequestException('Service details not found');
    }

    const interval = this.calculateInterval(serviceDetails);

    const bookingHours = this.getBookingHoursForDay(business.bookingHours, newAppointmentDate);
    if (!bookingHours) {
      ErrorHelper.BadRequestException('No booking hours found for the given date');
    }

    const [startHour, startMinute] = newStartTime.split(':').map(Number);
    const endDate = new Date(newAppointmentDate);
    endDate.setUTCHours(startHour);
    endDate.setUTCMinutes(startMinute + interval);

    const newEndTime = `${endDate.getUTCHours().toString().padStart(2, '0')}:${endDate
      .getUTCMinutes()
      .toString()
      .padStart(2, '0')}`;

    const existingAppointment = await this.appointmentRepository.findOneAppointment(
      business.id,
      newAppointmentDate,
      newStartTime,
      newEndTime
    );
    if (existingAppointment) {
      ErrorHelper.BadRequestException('This time slot is already booked');
    }

    appointment.appointmentDate = newAppointmentDate;
    appointment.startTime = newStartTime;
    appointment.endTime = newEndTime;
    appointment.rescheduleRequested = false;
    appointment.rescheduleMessage = null;

    const updatedAppointment = await this.appointmentRepository.saveAppointment(appointment);

    // Send notification to business
    await this.notificationService.queueNotification({
      userId: business.owner.id,
      type: NotificationType.RESCHEDULE_CONFIRMED,
      metadata: {
        appointmentId: appointment.id,
        newDate: newDate,
        newStartTime: newStartTime,
        newEndTime: newEndTime,
        businessName: business.businessName,
        serviceName: serviceDetails.serviceName,
      },
    });

    return updatedAppointment;
  }

  //TODO: send notification to the user about cancelled   appointment and also the business service and staff

  async cancelAppointment(
    userId: string,
    appointmentId: string,
    cancelAppointmentDto: CancelAppointmentDto
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOneById(appointmentId);
    if (!appointment) {
      ErrorHelper.NotFoundException('Appointment not found');
    }

    if (appointment.customer.id !== userId) {
      ErrorHelper.ForbiddenException('You do not have permission to cancel this appointment');
    }

    appointment.rescheduleRequested = false;
    appointment.rescheduleMessage = null;
    appointment.reasonForCancellation = cancelAppointmentDto.reasonForCancellation;

    await this.appointmentRepository.saveAppointment(appointment);

    const cancelledAppointment = await this.appointmentRepository.userCancelAppointment(
      appointment.id
    );

    const business = await this.businessService.findBusiness(appointment.businessProfile.id);
    if (business) {
      await this.notificationService.queueNotification({
        userId: business.owner.id,
        type: NotificationType.CANCELLED_APPOINTMENT,
        metadata: {
          appointmentId: cancelledAppointment.id,
          businessName: cancelledAppointment.businessProfile.businessName,
          serviceName: cancelledAppointment.serviceDetails.serviceName,
          date: cancelledAppointment.appointmentDate,
          startTime: cancelledAppointment.startTime,
          endTime: cancelledAppointment.endTime,
        },
      });
    }
    // Send notifications
    await this.notificationService.queueNotification({
      userId: userId,
      type: NotificationType.CANCELLED_APPOINTMENT,
      metadata: {
        appointmentId: cancelledAppointment.id,
        businessName: cancelledAppointment.businessProfile.businessName,
        serviceName: cancelledAppointment.serviceDetails.serviceName,
        date: cancelledAppointment.appointmentDate,
        startTime: cancelledAppointment.startTime,
        endTime: cancelledAppointment.endTime,
      },
    });

    return cancelledAppointment;
  }

  async confirmAndAssignAppointmentToStaff(appointmentId: string, staffId: string) {
    const appointment = await this.appointmentRepository.findOneById(appointmentId);

    if (!appointment) {
      ErrorHelper.NotFoundException('Appointment not found');
    }

    const staff = await this.staffsService.findOne(staffId);

    if (!staff) {
      ErrorHelper.NotFoundException('Staff not found');
    }

    if (staff.businessProfile.id !== appointment.businessProfile.id) {
      ErrorHelper.NotFoundException('Staff does not belong to the business');
    }

    appointment.status = AppointmentStatus.CONFIRMED;
    appointment.assignedStaff = staff;

    return await this.appointmentRepository.saveAppointment(appointment);
  }

  async getCustomerAppointments(userId) {
    return await this.appointmentRepository.findAllAppointmentsByCustomerId(userId);
  }

  async getBookedSlots(businessId: string, date: string) {
    return await this.appointmentRepository.getBookedSlots(businessId, date);
  }

  async getTotalNumberOfBookings(businessId: string): Promise<number> {
    return await this.appointmentRepository.totalNumberOfBookings(businessId);
  }

  async getBusinessAppointmentsByStatus(businessId: string) {
    return await this.appointmentRepository.findBusinessAppointmentsByStatus(businessId);
  }

  async getStaffAppointmentsByAppointmentStatus(staff: string) {
    return await this.appointmentRepository.findStaffAppointmentsByStatus(staff);
  }
  private calculateInterval(serviceDetails: { timeHours: number; timeMinutes: number }): number {
    return serviceDetails.timeHours * 60 + serviceDetails.timeMinutes;
  }

  async findUpcomingAppointments(startTime: Date, endTime: Date): Promise<Appointment[]> {
    return await this.appointmentRepository.findUpcomingAppointments(startTime, endTime);
  }

  async getAllAppointmentsForToday(): Promise<Appointment[]> {
    return await this.appointmentRepository.getAllAppointmentsForToday();
  }

  async updateAppointmentStatus(
    appointmentId: string,
    status: AppointmentStatus
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOneById(appointmentId);

    if (!appointment) {
      ErrorHelper.NotFoundException('Appointment not found');
    }

    appointment.status = status;
    return await this.appointmentRepository.saveAppointment(appointment);
  }

  async confirmAppointment(appointmentId: string, userId: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOneById(appointmentId);

    if (!appointment) {
      ErrorHelper.NotFoundException('Appointment not found');
    }

    const business = await this.businessService.findBusiness(appointment.businessProfile.id);
    if (!business) {
      ErrorHelper.BadRequestException('Business not found');
    }

    if (business.owner.id !== userId) {
      ErrorHelper.ForbiddenException('You do not have permission to confirm this appointment');
    }

    appointment.status = AppointmentStatus.UPCOMING;
    const updatedAppointment = await this.appointmentRepository.saveAppointment(appointment);

    // Send notifications if needed
    await this.notificationService.queueNotification({
      userId: appointment.customer.id,
      type: NotificationType.APPOINTMENT_CONFIRMED,
      metadata: {
        appointmentId: appointment.id,
        businessName: business.businessName,
        serviceName: appointment.serviceDetails.serviceName,
        date: appointment.appointmentDate,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
      },
    });

    return updatedAppointment;
  }

  private getBookingHoursForDay(
    bookingHours: { day: string; from: string; to: string }[],
    date: Date
  ): { from: string; to: string } | null {
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
    return bookingHours.find(bh => bh.day === dayOfWeek) || null;
  }

  async findAllCustomersByBusinessId(
    businessId: string,
    paginationDto: PaginationDto
  ): Promise<PaginationResultDto<Appointment>> {
    return await this.appointmentRepository.findAllCustomersByBusinessId(businessId, paginationDto);
  }

  async findAppointmentsByCustomerAndBusiness(
    businessId: string,
    customerId: string
  ): Promise<Appointment[]> {
    return await this.appointmentRepository.findAllAppointmentsByCustomerAndBusinessId(
      businessId,
      customerId
    );
  }
}
