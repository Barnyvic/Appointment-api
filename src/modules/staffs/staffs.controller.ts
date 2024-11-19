import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto, UpdateUserDto } from './dto/update-staff.dto';
import { HttpResponse } from 'src/utils';
import { Roles } from 'src/decorators';
import { RolesGuard } from 'src/guards/role.guard';
import { AppointmentStatus } from '../appointments/enum/appointmnet-status.enum';

@Controller('staffs')
export class StaffsController {
  constructor(private readonly staffsService: StaffsService) {}

  @Post(':businessId')
  @Roles(['SERVICE_PROVIDER'])
  @UseGuards(RolesGuard)
  async create(@Body() createStaffDto: CreateStaffDto, @Param('businessId') businessId: string) {
    const data = await this.staffsService.create(businessId, createStaffDto);
    return HttpResponse.success({
      data,
      message: 'staff successfully created....',
    });
  }

  @Get(':businessId')
  @Roles(['SERVICE_PROVIDER', 'STAFF'])
  @UseGuards(RolesGuard)
  async findAll(@Param('businessId') businessId: string) {
    const data = await this.staffsService.findAll(businessId);
    return HttpResponse.success({
      data,
      message: 'All staff retrieved successfully.',
    });
  }

  @Get('/get-staff/:id')
  @Roles(['SERVICE_PROVIDER', 'STAFF'])
  @UseGuards(RolesGuard)
  async findOne(@Param('id') id: string) {
    const data = await this.staffsService.findOne(id);
    return HttpResponse.success({
      data,
      message: `Staff with ID ${id} retrieved successfully.`,
    });
  }

  @Patch(':id')
  @Roles(['SERVICE_PROVIDER'])
  @UseGuards(RolesGuard)
  async update(
    @Param('id') id: string,
    @Body() updateStaffDto: UpdateStaffDto,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const data = await this.staffsService.update(id, updateStaffDto, updateUserDto);
    return HttpResponse.success({
      data,
      message: `Staff with ID ${id} updated successfully.`,
    });
  }
  @Delete(':id')
  @Roles(['SERVICE_PROVIDER'])
  @UseGuards(RolesGuard)
  async remove(@Param('id') id: string) {
    await this.staffsService.remove(id);
    return HttpResponse.success({
      data: {},
      message: `Staff with ID ${id} deleted successfully.`,
    });
  }

  @Get(':id/appointments')
  @Roles(['SERVICE_PROVIDER', 'STAFF'])
  @UseGuards(RolesGuard)
  async getStaffAppointments(@Param('id') id: string) {
    const data = await this.staffsService.getStaffAppointments(id);
    return HttpResponse.success({
      data,
      message: `Appointments for staff with ID ${id} retrieved successfully.`,
    });
  }
}
