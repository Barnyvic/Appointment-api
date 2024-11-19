import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from './dto';
import { Roles } from 'src/decorators';
import { RolesGuard } from 'src/guards/role.guard';
import { HttpResponse } from 'src/utils';
import { AnnouncementService } from './announcement.service';

@Controller('announcements')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Get('/:businessId')
  @Roles(['SERVICE_PROVIDER'])
  @UseGuards(RolesGuard)
  async getAll(@Param('businessId') businessId: string) {
    const data = await this.announcementService.getAllAnnouncements(businessId);

    if (data.length === 0) {
      return HttpResponse.success({
        data: [],
        message: 'No announcements found for the specified business',
      });
    }
    return HttpResponse.success({
      data,
      message: 'All announcements retrieved successfully',
    });
  }

  @Post('/:businessId')
  @Roles(['SERVICE_PROVIDER'])
  @UseGuards(RolesGuard)
  async create(
    @Param('businessId') businessId: string,
    @Body() createAnnouncementDto: CreateAnnouncementDto
  ) {
    const data = await this.announcementService.createAnnouncement(
      businessId,
      createAnnouncementDto
    );
    return HttpResponse.success({
      data,
      message: 'Announcement created successfully',
    });
  }

  @Put('/:announcementId')
  @Roles(['SERVICE_PROVIDER'])
  @UseGuards(RolesGuard)
  async update(
    @Param('announcementId') announcementId: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto
  ) {
    const data = await this.announcementService.updateAnnouncement(
      announcementId,
      updateAnnouncementDto
    );
    return HttpResponse.success({
      data,
      message: 'Announcement updated successfully',
    });
  }

  @Delete('/:announcementId')
  @Roles(['SERVICE_PROVIDER'])
  @UseGuards(RolesGuard)
  async remove(@Param('announcementId') announcementId: string) {
    await this.announcementService.deleteAnnouncement(announcementId);
    return HttpResponse.success({
      data: {},
      message: 'Announcement deleted successfully',
    });
  }
}
