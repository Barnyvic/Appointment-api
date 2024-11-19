import { Injectable } from '@nestjs/common';
import { FilterCashflowDto } from './dto/filter-cashflow.dto';
import { CashFlow } from './entities';
import { CreateCashFlowDto } from './dto/create-cashflow.dto';
import { UpdateCashFlowDto } from './dto/update-cashflow';
import { CashFlowRepository } from './repository/cashfllow.repository';
import { ErrorHelper } from 'src/utils';
import { CashFlowResultDto } from './dto/cashflow.dto';
import { BusinessService } from '../business/services/business.service';

@Injectable()
export class CashFlowService {
  constructor(
    private readonly cashFlowRepository: CashFlowRepository,
    private readonly businessService: BusinessService
  ) {}

  async create(businessId: string, createCashFlowDto: CreateCashFlowDto): Promise<CashFlow> {
    try {
      const business = await this.businessService.findBusiness(businessId);
      if (!business) {
        ErrorHelper.NotFoundException(`Business with ID "${businessId}" not found`);
      }

      return await this.cashFlowRepository.createCashFlow(createCashFlowDto, business);
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorHelper.InternalServerErrorException(
          `Failed to create CashFlow record: ${error.message}`
        );
      } else {
        ErrorHelper.InternalServerErrorException('Failed to create CashFlow record: Server Error');
      }
    }
  }

  async findOneById(id: string): Promise<CashFlow> {
    try {
      const cashFlow = await this.cashFlowRepository.findOneById(id);
      if (!cashFlow) {
        ErrorHelper.NotFoundException(`CashFlow record with ID "${id}" not found`);
      }
      return cashFlow;
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorHelper.InternalServerErrorException(
          `Failed to retrieve CashFlow record: ${error.message}`
        );
      } else {
        ErrorHelper.InternalServerErrorException(
          'Failed to retrieve CashFlow record: Server Error'
        );
      }
    }
  }

  async findAll(
    businessId: string,
    filterDto: FilterCashflowDto
  ): Promise<CashFlowResultDto<CashFlow>> {
    try {
      return await this.cashFlowRepository.findCashFlows(businessId, filterDto);
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorHelper.InternalServerErrorException(
          `Failed to retrieve CashFlow records: ${error.message}`
        );
      } else {
        ErrorHelper.InternalServerErrorException(
          'Failed to retrieve CashFlow records: Server Error'
        );
      }
    }
  }

  async update(id: string, updateCashFlowDto: UpdateCashFlowDto): Promise<CashFlow> {
    try {
      const cashFlow = await this.findOneById(id);
      if (!cashFlow) {
        ErrorHelper.NotFoundException(`CashFlow record with ID "${id}" not found`);
      }
      await this.cashFlowRepository.updateCashFlow(id, updateCashFlowDto);
      return this.findOneById(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorHelper.InternalServerErrorException(
          `Failed to update CashFlow record: ${error.message}`
        );
      } else {
        ErrorHelper.InternalServerErrorException('Failed to update CashFlow record: Server Error');
      }
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const cashFlow = await this.findOneById(id);
      if (!cashFlow) {
        ErrorHelper.NotFoundException(`CashFlow record with ID "${id}" not found`);
      }
      await this.cashFlowRepository.removeCashFlow(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorHelper.InternalServerErrorException(
          `Failed to delete CashFlow record: ${error.message}`
        );
      } else {
        ErrorHelper.InternalServerErrorException('Failed to delete CashFlow record: Server Error');
      }
    }
  }

  async countTotalCashFlowForBusiness(businessId: string): Promise<number> {
    try {
      return await this.cashFlowRepository.countTotalCashFlows(businessId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorHelper.InternalServerErrorException(
          `Failed to count total CashFlow for business: ${error.message}`
        );
      } else {
        ErrorHelper.InternalServerErrorException(
          'Failed to count total CashFlow for business: Server Error'
        );
      }
    }
  }
}
