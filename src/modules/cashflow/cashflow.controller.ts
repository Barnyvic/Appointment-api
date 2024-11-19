import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { FilterCashflowDto } from './dto/filter-cashflow.dto';
import { Roles } from 'src/decorators';
import { RolesGuard } from 'src/guards/role.guard';
import { HttpResponse } from 'src/utils';
import { CashFlowService } from './cashflow.service';
import { CreateCashFlowDto } from './dto/create-cashflow.dto';
import { UpdateCashFlowDto } from './dto/update-cashflow';

@Controller('cash-flows')
export class CashflowController {
  constructor(private readonly cashFlowService: CashFlowService) {}
  @Get('/:businessId')
  @Roles(['SERVICE_PROVIDER'])
  @UseGuards(RolesGuard)
  async getAll(@Param('businessId') businessId: string, @Query() filterDto: FilterCashflowDto) {
    const data = await this.cashFlowService.findAll(businessId, filterDto);

    if (data.data.length === 0) {
      return HttpResponse.success({
        data: [],
        message: 'No cashflow found matching the specified criteria',
      });
    }
    return HttpResponse.success({
      data: data.data,
      message: 'All cashflow retrieved  successfully',
    });
  }

  @Post('/:businessId')
  @Roles(['SERVICE_PROVIDER'])
  @UseGuards(RolesGuard)
  async create(
    @Param('businessId') businessId: string,
    @Body() createCashFlowDto: CreateCashFlowDto
  ) {
    const data = await this.cashFlowService.create(businessId, createCashFlowDto);
    return HttpResponse.success({
      data,
      message: 'Business cashflow created   successfully',
    });
  }

  @Put('/:cashFlowId')
  @Roles(['SERVICE_PROVIDER'])
  @UseGuards(RolesGuard)
  async update(
    @Param('cashFlowId') cashFlowId: string,
    @Body() updateCashFlowDto: UpdateCashFlowDto
  ) {
    const data = await this.cashFlowService.update(cashFlowId, updateCashFlowDto);
    return HttpResponse.success({
      data,
      message: 'Business cashflow updated   successfully',
    });
  }

  @Delete('/:cashFlowId')
  @Roles(['SERVICE_PROVIDER'])
  @UseGuards(RolesGuard)
  async remove(@Param('cashFlowId') cashFlowId: string) {
    await this.cashFlowService.remove(cashFlowId);
    return HttpResponse.success({
      data: {},
      message: 'Business cashflow deleted   successfully',
    });
  }
}
