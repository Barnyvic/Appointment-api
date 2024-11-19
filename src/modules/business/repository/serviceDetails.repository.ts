import { CustomRepository } from 'src/typeorm-extension';
import { IsNull, Repository, In } from 'typeorm';
import { BusinessProfile, ServiceDetails } from '../entities';
import { CreateServiceDetailsDto } from '../dto/create-service-details';
import { UpdateServiceDetailsDto } from '../dto/update-service-details';

@CustomRepository(ServiceDetails)
export class ServiceDetailsRepository extends Repository<ServiceDetails> {
  async findOneService(id: string): Promise<ServiceDetails> {
    return this.findOne({ where: { id }, relations: ['businessProfile'] });
  }

  async createServiceDetails(
    createServiceDetailsDto: CreateServiceDetailsDto,
    businessProfile: BusinessProfile
  ): Promise<ServiceDetails> {
    const serviceDetails = this.create({
      ...createServiceDetailsDto,
      businessProfile,
    });
    return this.save(serviceDetails);
  }

  async findAllServiceDetailsByBusinessId(businessId: string): Promise<ServiceDetails[]> {
    return this.find({
      where: {
        businessProfile: { id: businessId },
        deletedAt: IsNull(),
      },
    });
  }

  async updateServiceDetails(
    serviceDetails: ServiceDetails,
    updateServiceDetailsDto: UpdateServiceDetailsDto
  ): Promise<ServiceDetails> {
    Object.assign(serviceDetails, updateServiceDetailsDto);
    return this.save(serviceDetails);
  }

  async deleteServiceDetails(serviceDetailId: string) {
    return await this.softDelete(serviceDetailId);
  }

  async setArchiveStatus(serviceId: string, isArchived: boolean): Promise<void> {
    await this.update(serviceId, { isArchived });
  }

  async findByServiceIds(ids: string[]): Promise<ServiceDetails[]> {
    return this.find({
      where: {
        id: In(ids),
        deletedAt: IsNull(),
      },
    });
  }
}
