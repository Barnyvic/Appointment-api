import { Injectable } from '@nestjs/common';
import { AnnouncementRepository } from './announcement.repository';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from './dto/index';
import { ErrorHelper } from 'src/utils';
import { Announcement } from './entities/announcement.entity';
import { BusinessService } from '../business/services/business.service';

@Injectable()
export class AnnouncementService {
  constructor(
    private readonly announcementRepository: AnnouncementRepository,
    private readonly businessService: BusinessService
  ) {}

  async createAnnouncement(
    businessId: string,
    createAnnouncementDto: CreateAnnouncementDto
  ): Promise<Announcement> {
    try {
      const business = await this.businessService.findBusiness(businessId);
      if (!business) {
        ErrorHelper.NotFoundException(`Business with ID "${businessId}" not found`);
      }
      return await this.announcementRepository.createAnnouncement(createAnnouncementDto, business);
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorHelper.InternalServerErrorException(`Failed to create announcement: ${error.message}`);
      } else {
        ErrorHelper.InternalServerErrorException('Failed to create announcement: Server Error');
      }
    }
  }

  async updateAnnouncement(
    id: string,
    updateAnnouncementDto: UpdateAnnouncementDto
  ): Promise<Announcement> {
    try {
      const announcement = await this.announcementRepository.findAnnouncementById(id);
      if (!announcement) {
        ErrorHelper.NotFoundException(`announcement with ID "${announcement.id}" not found`);
      }
      return await this.announcementRepository.updateAnnouncement(
        announcement,
        updateAnnouncementDto
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorHelper.InternalServerErrorException(`Failed to update announcement: ${error.message}`);
      } else {
        ErrorHelper.InternalServerErrorException('Failed to update announcement: Server Error');
      }
    }
  }

  async deleteAnnouncement(id: string): Promise<void> {
    try {
      const announcement = await this.announcementRepository.findAnnouncementById(id);
      if (!announcement) {
        ErrorHelper.NotFoundException(`announcement with ID "${announcement.id}" not found`);
      }
      return await this.announcementRepository.deleteAnnouncement(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorHelper.InternalServerErrorException(`Failed to delete announcement: ${error.message}`);
      } else {
        ErrorHelper.InternalServerErrorException('Failed to delete announcement: Server Error');
      }
    }
  }

  async getAllAnnouncements(businessId: string): Promise<Announcement[]> {
    try {
      const business = await this.businessService.findBusiness(businessId);
      if (!business) {
        ErrorHelper.NotFoundException(`Business with ID "${businessId}" not found`);
      }

      return await this.announcementRepository.findAllAnnouncements(businessId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorHelper.InternalServerErrorException(
          `Failed to retrieve announcements: ${error.message}`
        );
      } else {
        ErrorHelper.InternalServerErrorException('Failed to retrieve announcements: Server Error');
      }
    }
  }

  async getAnnouncementById(id: string): Promise<Announcement> {
    try {
      const announcement = await this.announcementRepository.findAnnouncementById(id);
      if (!announcement) {
        ErrorHelper.NotFoundException(`announcement with ID "${announcement.id}" not found`);
      }
      return announcement;
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorHelper.InternalServerErrorException(
          `Failed to retrieve announcement: ${error.message}`
        );
      } else {
        ErrorHelper.InternalServerErrorException('Failed to retrieve announcement: Server Error');
      }
    }
  }
}
