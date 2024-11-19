import { CustomRepository } from 'src/typeorm-extension';
import { Repository } from 'typeorm';
import { Staff } from './entities';
import { BusinessProfile } from '../business/entities/business.entity';
import { User } from '../users/entities';
import { ServiceDetails } from '../business/entities';

@CustomRepository(Staff)
export class StaffRepository extends Repository<Staff> {
  async findOneById(staffId: string): Promise<Staff> {
    return await this.findOne({
      where: { id: staffId },
      relations: ['businessProfile', 'user', 'services'],
    });
  }

  async findOneByUserId(userId: string): Promise<Staff> {
    return await this.findOne({
      where: { user: { id: userId } },
      relations: ['businessProfile', 'user'],
    });
  }

  async createStaff(
    user: User,
    businessProfile: BusinessProfile,
    services: ServiceDetails[]
  ): Promise<Staff> {
    const createdStaff = await this.create({
      user,
      businessProfile,
      services,
    });
    return this.save(createdStaff);
  }

  async updateStaff(staffId: string, updateStaffDto: Partial<Staff>): Promise<Staff> {
    await this.update(staffId, updateStaffDto);
    return this.findOneById(staffId);
  }
  async findAllStaff(businessId: string): Promise<Staff[]> {
    return this.find({
      where: { businessProfile: { id: businessId } },
      relations: ['user', 'services'],
    });
  }

  async deleteStaff(staffId: string): Promise<void> {
    await this.delete(staffId);
  }
}
