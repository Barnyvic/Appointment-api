import { Injectable } from '@nestjs/common';
import { BusinessRepository } from '../repository/business.repository';
import { ServiceDetailsRepository } from '../repository/serviceDetails.repository';
import { CreateServiceDetailsDto } from '../dto/create-service-details';
import { ServiceDetails } from '../entities';
import { ErrorHelper } from 'src/utils/error.utils';
import { UpdateServiceDetailsDto } from '../dto/update-service-details';

@Injectable()
export class ServiceDetailsService {
  constructor(
    private readonly serviceDetailsRepository: ServiceDetailsRepository,
    private readonly businessRepository: BusinessRepository
  ) {}

  async createServiceDetails(
    businessProfileId: string,
    createServiceDetailsDto: CreateServiceDetailsDto
  ): Promise<ServiceDetails> {
    const businessProfile = await this.businessRepository.findOneById(businessProfileId);
    if (!businessProfile) {
      ErrorHelper.NotFoundException(`Business with ID "${businessProfileId}" not found`);
    }

    // Create the service details
    const serviceDetails = await this.serviceDetailsRepository.createServiceDetails(
      createServiceDetailsDto,
      businessProfile
    );

    return serviceDetails;
  }

  async getServiceDetailsById(serviceDetailsId: string): Promise<ServiceDetails> {
    const serviceDetails = await this.serviceDetailsRepository.findOneService(serviceDetailsId);
    if (!serviceDetails) {
      ErrorHelper.NotFoundException(`Business service with ID "${serviceDetailsId}" not found`);
    }
    return serviceDetails;
  }

  async getAllServiceDetails(businessId: string): Promise<ServiceDetails[]> {
    return this.serviceDetailsRepository.findAllServiceDetailsByBusinessId(businessId);
  }

  async updateServiceDetails(
    serviceDetailId: string,
    updateServiceDetailsDto: UpdateServiceDetailsDto
  ): Promise<ServiceDetails> {
    const serviceDetails = await this.getServiceDetailsById(serviceDetailId);
    return this.serviceDetailsRepository.updateServiceDetails(
      serviceDetails,
      updateServiceDetailsDto
    );
  }

  async deleteServiceDetails(serviceDetailId: string) {
    const result = await this.serviceDetailsRepository.deleteServiceDetails(serviceDetailId);
    if (result.affected === 0) {
      ErrorHelper.NotFoundException(`Business service with ID "${serviceDetailId}" not found`);
    }
  }

  async setArchiveStatus(serviceId: string, archive: boolean): Promise<void> {
    await this.serviceDetailsRepository.setArchiveStatus(serviceId, archive);
  }

  async findByIds(ids: string[]): Promise<ServiceDetails[]> {
    return this.serviceDetailsRepository.findByServiceIds(ids);
  }
}
