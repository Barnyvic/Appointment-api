import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { HttpResponse } from 'src/utils';
import { PaginationDto } from 'src/queries/dto';
import { AuthGuard } from 'src/guards';
import { FilterBusinessesDto } from '../dto/filter-business.dto';
import { BusinessService } from '../services/business.service';
import { CreateServiceDetailsDto } from '../dto/create-service-details';
import { ServiceDetailsService } from '../services/serviceDetails.service';
import { UpdateServiceDetailsDto } from '../dto/update-service-details';
import { Roles, User } from 'src/decorators';
import { RolesGuard } from 'src/guards/role.guard';
import { IUser } from 'src/interfaces';
import { UpdateBusinessProfileDto } from '../dto/update-business.dto';
import { AppointmentStatus } from 'src/modules/appointments/enum/appointmnet-status.enum';
import { Point } from 'typeorm';

@Controller('businesses')
export class BusinessController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly serviceDetailsService: ServiceDetailsService
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getBusinesses(
    @Query() filterDto: FilterBusinessesDto,
    @Query() paginationDto: PaginationDto
  ) {
    const data = await this.businessService.findAllBusinesses(filterDto, paginationDto);
    if (data.data.length === 0) {
      return HttpResponse.success({
        data: [],
        message: 'No businesses found matching the specified criteria',
      });
    }

    return HttpResponse.success({
      data,
      message: 'Businesses retrieved successfully',
    });
  }

  // 1. Get a list of customers for a specific business
  @Get(':businessId/customers')
  @UseGuards(AuthGuard)
  async getCustomers(
    @Param('businessId') businessId: string,
    @Query() paginationDto: PaginationDto
  ) {
    const data = await this.businessService.findAllCustomers(businessId, paginationDto);
    return HttpResponse.success({
      data,
      message: 'Customers retrieved successfully',
    });
  }

  // 4. Get appointment history for a specific customer within a business
  @Get(':businessId/customers/:customerId/appointments')
  @UseGuards(AuthGuard)
  async getCustomerAppointments(
    @Param('businessId') businessId: string,
    @Param('customerId') customerId: string
  ) {
    const data = await this.businessService.getCustomerAppointments(businessId, customerId);
    return HttpResponse.success({
      data,
      message: 'Appointments retrieved successfully',
    });
  }

  @Get(':businessId')
  @UseGuards(AuthGuard)
  async getBusinessById(@Param('businessId') businessId: string) {
    const data = await this.businessService.findOneBusiness(businessId);
    return HttpResponse.success({
      data,
      message: 'Businesses retrieved successfully',
    });
  }
  @Post('create-service/:businessId')
  @Roles(['SERVICE_PROVIDER'])
  @UseGuards(RolesGuard)
  async createService(
    @Param('businessId') businessId: string,
    @Body() createServiceDetailsDto: CreateServiceDetailsDto
  ) {
    const data = await this.serviceDetailsService.createServiceDetails(
      businessId,
      createServiceDetailsDto
    );
    return HttpResponse.success({
      data,
      message: 'Business service details created successfully',
    });
  }

  @Put(':businessId')
  @UseGuards(AuthGuard)
  async updateBusiness(
    @Param('businessId') businessId: string,
    @Body() updateBusinessProfileDto: UpdateBusinessProfileDto
  ) {
    const data = await this.businessService.updateBusinessProfile(
      businessId,
      updateBusinessProfileDto
    );
    return HttpResponse.success({
      data,
      message: 'Business profile updated successfully',
    });
  }

  @Get('user/businesses')
  @Roles(['SERVICE_PROVIDER'])
  @UseGuards(RolesGuard)
  async findAllByUserId(@User() user: IUser, @Query() paginationDto: PaginationDto) {
    const data = await this.businessService.findAllByUserId(user.id, paginationDto);
    return HttpResponse.success({
      data,
      message: 'User business retrieved successfully',
    });
  }

  @Get('services/:businessId')
  @UseGuards(AuthGuard)
  async getAllServices(@Param('businessId') businessId: string) {
    const data = await this.serviceDetailsService.getAllServiceDetails(businessId);

    if (data.length === 0) {
      return HttpResponse.success({
        data: [],
        message: 'No services  found matching this particular  business',
      });
    }

    return HttpResponse.success({
      data,
      message: 'Business services retrieved successfully',
    });
  }

  @Get('get-service/:serviceDetailId')
  @UseGuards(AuthGuard)
  async getServiceById(@Param('serviceDetailId') serviceDetailId: string) {
    const data = await this.serviceDetailsService.getServiceDetailsById(serviceDetailId);
    return HttpResponse.success({
      data,
      message: 'Business service retrieved  successfully',
    });
  }

  @Delete('delete-service/:serviceDetailId')
  @Roles(['SERVICE_PROVIDER'])
  @UseGuards(RolesGuard)
  async deleteService(@Param('serviceDetailId') serviceDetailId: string) {
    this.serviceDetailsService.deleteServiceDetails(serviceDetailId);
    return HttpResponse.success({
      data: {},
      message: 'Business service detail deleted successfully',
    });
  }

  @Put('update-service/:serviceDetailId')
  @Roles(['SERVICE_PROVIDER'])
  @UseGuards(RolesGuard)
  async updateServiceDetails(
    @Param('serviceDetailId') serviceDetailId: string,
    @Body() updateServiceDetailsDto: UpdateServiceDetailsDto
  ) {
    const data = await this.serviceDetailsService.updateServiceDetails(
      serviceDetailId,
      updateServiceDetailsDto
    );
    return HttpResponse.success({
      data,
      message: 'Service details updated successfully',
    });
  }

  @Patch('services/:serviceDetailId')
  @Roles(['SERVICE_PROVIDER'])
  @UseGuards(RolesGuard)
  async updateArchiveStatus(
    @Param('serviceDetailId') serviceDetailId: string,
    @Query('archive', ParseBoolPipe) archive: boolean
  ): Promise<void> {
    await this.serviceDetailsService.setArchiveStatus(serviceDetailId, archive);
  }

  @Get(':businessId/appointments')
  @UseGuards(AuthGuard)
  async getBusinessAppointments(@Param('businessId') businessId: string) {
    const data = await this.businessService.getBusinessAppointmentsByStatus(businessId);
    return HttpResponse.success({
      data,
      message: 'Appointments retrieved successfully',
    });
  }

  @Delete(':businessId/social-media/:handle')
  @UseGuards(AuthGuard)
  async deleteSocialMediaHandle(
    @Param('businessId') businessId: string,
    @Param('handle') handle: string
  ) {
    const data = await this.businessService.deleteSocialMediaHandle(businessId, handle);
    return HttpResponse.success({
      data,
      message: `Social media handle "${handle}" deleted successfully`,
    });
  }

  @Get('/users/recommendations')
  @UseGuards(AuthGuard)
  async recommendBusinesses(
    @User() user: IUser,
    @Query() paginationDto: PaginationDto,
    @Query('lat') lat?: number,
    @Query('lng') lng?: number
  ) {
    const userLocation: Point | null =
      lat !== undefined && lng !== undefined
        ? {
            type: 'Point',
            coordinates: [lng, lat],
          }
        : null;
    const data = await this.businessService.recommendBusinessesForUser(
      user.id,
      userLocation,
      paginationDto
    );
    return HttpResponse.success({
      data,
      message: `user personal recommendations retrieved successfully `,
    });
  }
}
