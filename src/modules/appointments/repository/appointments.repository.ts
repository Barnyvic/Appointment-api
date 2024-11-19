/* eslint-disable no-irregular-whitespace */
import { BusinessProfile, ServiceDetails } from 'src/modules/business/entities';
import { CustomRepository } from 'src/typeorm-extension';
import { Between, MoreThanOrEqual, Repository } from 'typeorm';
import { Appointment } from '../entities';
import { BookAppointmentDto } from '../dto/book-appointment.dto';
import { User } from 'src/modules/users/entities';
import { AppointmentStatus } from '../enum/appointmnet-status.enum';
import { Staff } from 'src/modules/staffs/entities';
import { AppointmentResponseDto } from '../dto/appointment-response.dto';
import { PageMetaDtoParameters } from 'src/interfaces';
import { PaginationDto, PaginationResultDto, PaginationMetadataDto } from 'src/queries/dto';

@CustomRepository(Appointment)
export class AppointmentRepository extends Repository<Appointment> {
  async createAppointment(
    businessProfile: BusinessProfile,
    serviceDetails: ServiceDetails,
    bookAppointmentDto: BookAppointmentDto,
    endTime: string,
    customer: User,
    staff?: Staff
  ): Promise<AppointmentResponseDto> {
    const appointmentStatus = customer ? AppointmentStatus.PENDING : AppointmentStatus.CONFIRMED;
    const appointment = this.create({
      appointmentDate: new Date(
        `${bookAppointmentDto.date}T${bookAppointmentDto.startTime}:00.000Z`
      ),
      startTime: bookAppointmentDto.startTime,
      endTime,
      customer,
      businessProfile: businessProfile,
      serviceDetails: serviceDetails,
      assignedStaff: staff,
      status: appointmentStatus,
      isAvailable: true,
      customerEmail: bookAppointmentDto.customerEmail,
      customerName: bookAppointmentDto.customerName,
      customerPhoneNumber: bookAppointmentDto.customerPhoneNumber,
    });
    const savedAppointment = await this.save(appointment);

    const transformedAppointment: AppointmentResponseDto = {
      id: appointment.id,
      appointmentDate: savedAppointment.appointmentDate.toISOString(),
      startTime: savedAppointment.startTime,
      endTime: savedAppointment.endTime,
      isAvailable: savedAppointment.isAvailable,
      customer: customer
        ? {
            id: customer.id,
            firstName: customer.firstName,
            lastName: customer.lastName,
          }
        : null,
      serviceDetails: {
        id: serviceDetails.id,
        serviceName: serviceDetails.serviceName,
        serviceType: serviceDetails.serviceType,
      },
      businessProfile: {
        id: businessProfile.id,
        businessName: businessProfile.businessName,
        businessAddress: businessProfile.businessAddress,
      },
      assignedStaff: staff
        ? {
            id: staff.id,
          }
        : null,
      customerEmail: savedAppointment.customerEmail,
      customerName: savedAppointment.customerName,
      customerPhoneNumber: savedAppointment.customerPhoneNumber,
      status: savedAppointment.status,
    };

    return transformedAppointment;
  }

  async findOneById(appointmentId: string): Promise<Appointment> {
    return await this.findOne({
      where: { id: appointmentId },
      relations: ['businessProfile', 'customer', 'assignedStaff', 'serviceDetails'],
    });
  }

  async userCancelAppointment(appointmentId: string): Promise<Appointment> {
    await this.update(appointmentId, { status: AppointmentStatus.CANCELED });
    return this.findOne({
      where: {
        id: appointmentId,
      },
      relations: ['businessProfile', 'customer', 'assignedStaff', 'serviceDetails'],
    });
  }

  async rescheduleAppointment(
    appointmentId: string,
    newDate: string,
    newStartTime: string,
    newEndTime: string,
    staff: Staff
  ): Promise<Appointment> {
    await this.update(appointmentId, {
      appointmentDate: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      assignedStaff: staff,
    });
    return this.findOne({
      where: {
        id: appointmentId,
      },
    });
  }

  async findOneAppointment(
    businessId: string,
    date: Date,
    startTime: string,
    endTime: string
  ): Promise<Appointment> {
    return this.findOne({
      where: { businessProfile: { id: businessId }, appointmentDate: date, startTime, endTime },
    });
  }

  async getServiceAvailabilities(serviceId: string): Promise<Appointment[]> {
    const currentDate = new Date();
    return this.find({
      select: ['id', 'appointmentDate', 'startTime', 'notes', 'isAvailable'],
      where: {
        serviceDetails: { id: serviceId },
        isAvailable: true,
        appointmentDate: MoreThanOrEqual(currentDate),
      },
    });
  }

  async findAllAppointmentsByCustomerId(customerId: string): Promise<Appointment[]> {
    const currentDate = new Date();

    return this.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.serviceDetails', 'serviceDetails')
      .leftJoin('appointment.businessProfile', 'businessProfile')
      .addSelect(['businessProfile.id', 'businessProfile.businessName'])
      .addSelect(['businessProfile.id', 'businessProfile.businessAddress'])
      .where('appointment.customerId = :customerId', { customerId })
      .andWhere('appointment.appointmentDate >= :currentDate', { currentDate })
      .getMany();
  }

  async deleteAppointment(appointmentId: string) {
    return await this.delete(appointmentId);
  }

  async getBookedSlots(businessId: string, date: string): Promise<Appointment[]> {
    const targetDate = new Date(date);

    const utcTargetDate = new Date(targetDate.getTime() + targetDate.getTimezoneOffset() * 60000);

    const startDate = new Date(utcTargetDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(utcTargetDate);
    endDate.setHours(23, 59, 59, 999);

    return await this.find({
      where: {
        businessProfile: { id: businessId },
        appointmentDate: Between(startDate, endDate),
      },
    });
  }

  async saveAppointment(appointment: Appointment) {
    return await this.save(appointment);
  }

  async totalNumberOfBookings(businessId: string): Promise<number> {
    const totalBookings = await this.count({
      where: { businessProfile: { id: businessId } },
    });
    return totalBookings;
  }

  async findBusinessAppointmentsByStatus(businessId: string): Promise<Appointment[]> {
    const currentDate = new Date();

    return this.find({
      where: {
        businessProfile: { id: businessId },
        appointmentDate: MoreThanOrEqual(currentDate),
      },
      relations: ['customer', 'serviceDetails', 'assignedStaff'],
      order: { appointmentDate: 'ASC' },
    });
  }

  async findStaffAppointmentsByStatus(staffId: string): Promise<Appointment[]> {
    const currentDate = new Date();

    return this.find({
      where: {
        assignedStaff: { id: staffId },
        appointmentDate: MoreThanOrEqual(currentDate),
      },
      relations: ['customer', 'serviceDetails', 'businessProfile'],
      order: { appointmentDate: 'ASC' },
    });
  }

  async findUpcomingAppointments(startTime: Date, endTime: Date): Promise<Appointment[]> {
    return this.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.customer', 'customer')
      .leftJoinAndSelect('appointment.businessProfile', 'businessProfile')
      .leftJoinAndSelect('businessProfile.owner', 'owner')
      .leftJoinAndSelect('appointment.assignedStaff', 'assignedStaff')
      .leftJoinAndSelect('assignedStaff.user', 'assignedStaffUser')
      .where('appointment.appointmentDate BETWEEN :startTime AND :endTime', { startTime, endTime })
      .getMany();
  }

  async getAllAppointmentsForToday(): Promise<Appointment[]> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return this.find({
      where: {
        appointmentDate: Between(startOfDay, endOfDay),
      },
      relations: ['customer', 'businessProfile', 'assignedStaff'],
    });
  }

  async findAllCustomersByBusinessId(
    businessId: string,
    paginationDto: PaginationDto
  ): Promise<PaginationResultDto<Appointment>> {
    const { limit, skip } = paginationDto;

    const queryBuilder = this.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.customer', 'customer')
      .where('appointment.businessProfileId = :businessId', { businessId })
      .groupBy('appointment.customerId')
      .addGroupBy('appointment.id')
      .addGroupBy('customer.id') // Include other required fields here as necessary
      .orderBy('customer.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    const pageMetaDtoParameters: PageMetaDtoParameters = {
      pageOptionsDto: paginationDto,
      itemCount: total,
    };

    const meta = new PaginationMetadataDto(pageMetaDtoParameters);

    // Returning the data with pagination metadata
    return new PaginationResultDto(data, meta);
  }
  async findAllAppointmentsByCustomerAndBusinessId(
    businessId: string,
    customerId: string
  ): Promise<Appointment[]> {
    return await this.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.customer', 'customer')
      .leftJoinAndSelect('appointment.serviceDetails', 'serviceDetails')
      .where('appointment.businessProfileId = :businessId', { businessId })
      .andWhere('appointment.customerId = :customerId', { customerId })
      .getMany();
  }
}
