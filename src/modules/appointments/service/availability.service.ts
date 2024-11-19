/* eslint-disable prefer-const */
import { Injectable } from '@nestjs/common';
import { AvailabilityRepository } from '../repository/availability.repository';
import { CreateAvailabilityDto } from '../dto/create-availability.dto';
import { Availability } from '../entities';
import { ErrorHelper } from 'src/utils';
import { AppointmentsService } from './appointments.service';
import { UpdateAvailabilityDto } from '../dto/update-availability.dto';
import { BusinessService } from 'src/modules/business/services/business.service';
import { StaffsService } from 'src/modules/staffs/staffs.service';

@Injectable()
export class AvailabilityService {
  constructor(
    private readonly availabilityRepository: AvailabilityRepository,
    private readonly staffsService: StaffsService,
    private readonly appointmentsService: AppointmentsService,
    private readonly businessService: BusinessService
  ) {}

  async createAvailability(
    businessId: string,
    staffId: string,
    createAvailabilityDto: CreateAvailabilityDto
  ): Promise<Availability> {
    const business = await this.businessService.findBusiness(businessId);
    const staff = await this.staffsService.findStaffByUserId(staffId);
    const staffIds = business.staff.map(s => s.id);
    if (!staffIds.includes(staff.id)) {
      ErrorHelper.NotFoundException('Staff Not associated with the business.');
    }
    const createdAvailability = this.availabilityRepository.createAvailability(
      business,
      createAvailabilityDto,
      staff
    );
    return createdAvailability;
  }
  //TODO: remove the staffId get all the time slots for the business and return it
  async getAvailabilitySlots(businessId: string, date: string, serviceId: string) {
    const appointmentDate = new Date(date);
    const currentDate = new Date();

    if (appointmentDate < currentDate) {
      throw ErrorHelper.NotFoundException('Cannot pick a date in the past.');
    }

    const business = await this.businessService.findBusiness(businessId);
    if (!business) {
      throw ErrorHelper.NotFoundException('Business not found');
    }

    const serviceDetails = business.services.find(service => service.id === serviceId);
    if (!serviceDetails) {
      throw ErrorHelper.NotFoundException('Service details not found');
    }

    const interval = this.calculateInterval(serviceDetails);

    const bookingHours = this.getBookingHoursForDay(business.bookingHours, appointmentDate);

    const availabilities = await this.availabilityRepository.getAvailabilitySlotsOfStaff(
      businessId,
      date,
      serviceId
    );

    if (!availabilities.length && !bookingHours) {
      throw ErrorHelper.NotFoundException(
        'No available time set for this service on the given date'
      );
    }

    const allSlots = availabilities.length
      ? this.generateAllSlots(availabilities, null, interval)
      : this.generateAllSlots([], bookingHours, interval);

    const bookedSlots = await this.appointmentsService.getBookedSlots(businessId, date);

    const availableSlots = allSlots
      .map(slot => ({
        time: slot,
        isBooked: bookedSlots.some(booked => booked.startTime === slot),
      }))
      .filter(slot => !slot.isBooked);

    return {
      date,
      slots: availableSlots,
    };
  }
  async updateAvailability(
    availabilityId: string,
    updateData: UpdateAvailabilityDto
  ): Promise<Availability> {
    const updatedAvailability = await this.availabilityRepository.updateAvailability(
      availabilityId,
      updateData
    );
    if (!updatedAvailability) {
      ErrorHelper.NotFoundException('Availability not found');
    }
    return updatedAvailability;
  }

  private calculateInterval(serviceDetails: { timeHours: number; timeMinutes: number }): number {
    return serviceDetails.timeHours * 60 + serviceDetails.timeMinutes;
  }

  private generateAllSlots(
    availabilities: Availability[],
    bookingHours: { from: string; to: string } | null,
    interval: number
  ): string[] {
    const allSlots: string[] = [];

    if (bookingHours) {
      const bookingSlots = this.generateSlots(bookingHours.from, bookingHours.to, interval);
      allSlots.push(...bookingSlots);
    }

    for (const availability of availabilities) {
      const slots = this.generateSlots(
        availability.startTime,
        availability.endTime,
        availability.interval
      );
      allSlots.push(...slots);
    }

    return allSlots;
  }
  private getBookingHoursForDay(
    bookingHours: { day: string; from: string; to: string }[],
    date: Date
  ): { from: string; to: string } | null {
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
    return bookingHours.find(bh => bh.day === dayOfWeek) || null;
  }

  private generateSlots(startTime: string, endTime: string, interval: number): string[] {
    const slots: string[] = [];

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    let current = new Date();
    current.setHours(startHour, startMinute, 0, 0);

    const end = new Date();
    end.setHours(endHour, endMinute, 0, 0);

    while (current < end) {
      const slotTime = this.formatTime(current);
      slots.push(slotTime);
      current.setMinutes(current.getMinutes() + interval);
    }

    return slots;
  }

  private formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  }
}
