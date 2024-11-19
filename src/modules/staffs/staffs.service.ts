/* eslint-disable prefer-const */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto, UpdateUserDto } from './dto/update-staff.dto';
import { StaffRepository } from './staff-repository';
import { Staff } from './entities';
import { BusinessService } from '../business/services/business.service';
import { UsersService } from '../users/users.service';
import { ErrorHelper, PasswordHelper } from 'src/utils';
import { ServiceDetailsService } from '../business/services/serviceDetails.service';
import { AppointmentStatus } from '../appointments/enum/appointmnet-status.enum';
import { AppointmentsService } from '../appointments/service/appointments.service';
import { Appointment } from '../appointments/entities';
import { NotificationService } from '../notifications/notification.service';
import { NotificationType } from 'src/interfaces';

@Injectable()
export class StaffsService {
  constructor(
    private readonly staffRepository: StaffRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => BusinessService))
    private readonly businessService: BusinessService,
    private readonly serviceDetailsService: ServiceDetailsService,
    @Inject(forwardRef(() => AppointmentsService))
    private readonly appointmentsService: AppointmentsService,
    private readonly notificationService: NotificationService
  ) {}
  async create(businessId: string, createStaffDto: CreateStaffDto) {
    const businessProfile = await this.businessService.findBusiness(businessId);
    if (!businessProfile) {
      ErrorHelper.NotFoundException('Business not found');
    }

    const nameParts = createStaffDto.name.split(' ');
    createStaffDto.firstName = nameParts[0];
    createStaffDto.lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    if (!createStaffDto.password) {
      createStaffDto.password = PasswordHelper.generatePassword();
    }

    const userExist = await this.usersService.createStaff(createStaffDto);

    const services = await this.serviceDetailsService.findByIds(createStaffDto.serviceIds);
    if (!services || services.length !== createStaffDto.serviceIds.length) {
      ErrorHelper.NotFoundException('One or more services not found');
    }
    await this.staffRepository.createStaff(userExist, businessProfile, services);
    await this.sendNotifications(
      businessProfile.owner.id,
      userExist.id,
      createStaffDto.emailAddress,
      createStaffDto.password
    );
    return this.usersService.signUserToken(userExist);
  }

  async findAll(businessId: string) {
    return await this.staffRepository.findAllStaff(businessId);
  }

  async findOne(staffId: string): Promise<Staff> {
    return await this.staffRepository.findOneById(staffId);
  }

  async findStaffByUserId(userId: string): Promise<Staff> {
    return await this.staffRepository.findOneByUserId(userId);
  }

  async update(
    staffId: string,
    updateStaffDto: UpdateStaffDto,
    updateUserDto: UpdateUserDto
  ): Promise<Staff> {
    const staff = await this.findOne(staffId);
    if (!staff) {
      ErrorHelper.NotFoundException(`Staff with ID "${staffId}" not found`);
    }
    // Update user details if provided
    if (Object.keys(updateUserDto).length > 0) {
      await this.usersService.update(staff.user.id, updateUserDto);
    }

    // Handle services update
    if (updateStaffDto.serviceIds) {
      const services = await this.serviceDetailsService.findByIds(updateStaffDto.serviceIds);
      if (!services || services.length !== updateStaffDto.serviceIds.length) {
        ErrorHelper.NotFoundException('One or more services not found');
      }
      staff.services = services;
    }
    // Handle business profile update
    let updateStaff: Partial<Staff> = {};
    if (updateStaffDto.businessProfileId) {
      const businessProfile = await this.businessService.findBusiness(
        updateStaffDto.businessProfileId
      );
      if (!businessProfile) {
        ErrorHelper.NotFoundException(
          `Business with ID "${updateStaffDto.businessProfileId}" not found`
        );
      }
      updateStaff.businessProfile = businessProfile;
    }

    // Handle services update separately
    if (updateStaffDto.serviceIds) {
      const services = await this.serviceDetailsService.findByIds(updateStaffDto.serviceIds);
      if (!services || services.length !== updateStaffDto.serviceIds.length) {
        ErrorHelper.NotFoundException('One or more services not found');
      }
      updateStaff.services = services;
    }

    // Save the updated staff entity
    await this.staffRepository.save({ ...staff, ...updateStaff });
    return this.findOne(staffId);
  }
  async remove(staffId: string): Promise<void> {
    const staff = await this.findOne(staffId);
    if (!staff) {
      ErrorHelper.NotFoundException(`Staff with ID "${staffId}" not found`);
    }
    await this.staffRepository.deleteStaff(staffId);
  }

  //TODO: fix this
  async getStaffAppointments(staffId: string): Promise<Appointment[]> {
    return await this.appointmentsService.getStaffAppointmentsByAppointmentStatus(staffId);
  }

  private async sendNotifications(
    ownerId: string,
    staffId: string,
    email: string,
    password: string
  ) {
    await this.notificationService.queueNotification({
      userId: ownerId,
      type: NotificationType.STAFF_CREATED,
      metadata: {
        email,
        password,
      },
    });
    await this.notificationService.queueNotification({
      userId: staffId,
      type: NotificationType.WELCOME_NEW_STAFF,
      metadata: {
        email,
        password,
        message: 'You can change your password anytime.',
      },
    });
  }
}
