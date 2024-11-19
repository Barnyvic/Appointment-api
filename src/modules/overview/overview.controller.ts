import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { OverViewService } from './overview.service';
import { Roles } from 'src/decorators';
import { RolesGuard } from 'src/guards/role.guard';
import { HttpResponse } from 'src/utils';

@Controller('overview')
export class OverViewController {
  constructor(private readonly overViewService: OverViewService) {}

  @Get('/service-provide/:businessId')
  @Roles(['SERVICE_PROVIDER'])
  @UseGuards(RolesGuard)
  async getOverview(@Param('businessId') businessId: string) {
    const data = await this.overViewService.getOverViewDashBoardForABusiness(businessId);

    return HttpResponse.success({
      data,
      message: 'Business overview retrieved successfully',
    });
  }
}
