import { CustomRepository } from 'src/typeorm-extension';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Availability } from '../entities';
import { CreateAvailabilityDto } from '../dto/create-availability.dto';
import { BusinessProfile } from 'src/modules/business/entities';
import { UpdateAvailabilityDto } from '../dto/update-availability.dto';
import { Staff } from 'src/modules/staffs/entities';

@CustomRepository(Availability)
export class AvailabilityRepository extends Repository<Availability> {
  async createAvailability(
    businessProfile: BusinessProfile,
    createAppointmentDto: CreateAvailabilityDto,
    staff: Staff
  ): Promise<Availability> {
    const appointment = this.create({
      ...createAppointmentDto,
      businessProfile: businessProfile,
      staff,
    });
    return this.save(appointment);
  }

  async findOneAvailability(
    businessId: string,
    date: string,
    startTime: string
  ): Promise<Availability> {
    if (!startTime.endsWith(':00')) {
      startTime = `${startTime}:00`;
    }
    return await this.findOne({
      where: {
        businessProfile: { id: businessId },
        date,
        startTime: LessThanOrEqual(startTime),
        endTime: MoreThanOrEqual(startTime),
      },
      relations: ['businessProfile', 'service'],
    });
  }

  async getAvailabilitySlotsOfStaff(
    businessId: string,
    date: string,
    serviceId: string
  ): Promise<Availability[]> {
    return this.createQueryBuilder('availability')
      .leftJoinAndSelect('availability.staff', 'staff')
      .leftJoinAndSelect('staff.services', 'service')
      .where('availability.businessProfileId = :businessId', { businessId })
      .andWhere('availability.date = :date', { date })
      .andWhere('service.id = :serviceId', { serviceId })
      .getMany();
  }

  async updateAvailability(id: string, updateData: UpdateAvailabilityDto): Promise<Availability> {
    await this.update(id, updateData);
    return this.findOne({ where: { id }, relations: ['businessProfile', 'service'] });
  }
}
