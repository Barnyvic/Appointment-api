import { CustomRepository } from '../../typeorm-extension';
import { Repository } from 'typeorm';
import { Announcement } from './entities';
import { BusinessProfile } from '../business/entities';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@CustomRepository(Announcement)
export class AnnouncementRepository extends Repository<Announcement> {
  async createAnnouncement(
    createAnnouncementDto: CreateAnnouncementDto,
    businessProfile: BusinessProfile
  ): Promise<Announcement> {
    const announcement = this.create({
      ...createAnnouncementDto,
      businessProfile,
    });
    return await this.save(announcement);
  }

  async updateAnnouncement(
    announcement: Announcement,
    updateAnnouncementDto: UpdateAnnouncementDto
  ): Promise<Announcement> {
    Object.assign(announcement, updateAnnouncementDto);
    await this.save(announcement);
    return await this.findAnnouncementById(announcement.id);
  }

  async deleteAnnouncement(id: string): Promise<void> {
    await this.delete(id);
  }

  async findAllAnnouncements(businessProfileId: string): Promise<Announcement[]> {
    return await this.find({ where: { businessProfile: { id: businessProfileId } } });
  }

  async findAnnouncementById(id: string): Promise<Announcement> {
    const announcement = await this.findOne({
      where: { id },
    });
    return announcement;
  }
}
