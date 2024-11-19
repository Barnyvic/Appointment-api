import { Repository } from 'typeorm';
import { CustomRepository } from '../../../typeorm-extension';
import { CreateCashFlowDto } from '../dto/create-cashflow.dto';
import { FilterCashflowDto } from '../dto/filter-cashflow.dto';
import { UpdateCashFlowDto } from '../dto/update-cashflow';
import { CashFlow } from '../entities';
import { CashFlowPeriod, CashFlowType } from '../enum/cash-flow-type.enum';
import { CashFlowResultDto } from '../dto/cashflow.dto';
import { BusinessProfile } from 'src/modules/business/entities';

@CustomRepository(CashFlow)
export class CashFlowRepository extends Repository<CashFlow> {
  async createCashFlow(
    createCashFlowDto: CreateCashFlowDto,
    business: BusinessProfile
  ): Promise<CashFlow> {
    const cashFlow = this.create({
      ...createCashFlowDto,
      businessProfile: business,
    });
    return await this.save(cashFlow);
  }

  async findOneById(id: string): Promise<CashFlow> {
    return this.findOne({ where: { id } });
  }

  async findCashFlows(
    businessId: string,
    filterDto: FilterCashflowDto
  ): Promise<CashFlowResultDto<CashFlow>> {
    const { startDate, endDate, type, period } = filterDto;

    const query = this.createQueryBuilder('cashFlow')
      .leftJoinAndSelect('cashFlow.businessProfile', 'businessProfile')
      .where('cashFlow.businessProfileId = :businessId', { businessId });

    if (startDate) {
      query.andWhere('cashFlow.date >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('cashFlow.date <= :endDate', { endDate });
    }

    if (type) {
      query.andWhere('cashFlow.type = :type', { type });
    }

    let periodDate: Date | undefined;

    if (period) {
      const currentDate = new Date();

      switch (period) {
        case CashFlowPeriod.TWELVE_HOURS:
          periodDate = new Date(currentDate.getTime() - 12 * 60 * 60 * 1000);
          break;
        case CashFlowPeriod.ONE_DAY:
          periodDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
          break;
        case CashFlowPeriod.ONE_WEEK:
          periodDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case CashFlowPeriod.ONE_MONTH:
          periodDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
          break;
        case CashFlowPeriod.ONE_YEAR:
          periodDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
          break;
      }

      query.andWhere('cashFlow.date >= :periodDate', { periodDate });
    }

    const totalIncomeQuery = this.createQueryBuilder('cashFlow')
      .select('SUM(cashFlow.amount)', 'totalIncome')
      .where('cashFlow.businessProfileId = :businessId', { businessId })
      .andWhere('cashFlow.type = :type', { type: CashFlowType.INCOME });

    const totalExpenseQuery = this.createQueryBuilder('cashFlow')
      .select('SUM(cashFlow.amount)', 'totalExpense')
      .where('cashFlow.businessProfileId = :businessId', { businessId })
      .andWhere('cashFlow.type = :type', { type: CashFlowType.EXPENSE });

    if (startDate) {
      totalIncomeQuery.andWhere('cashFlow.date >= :startDate', { startDate });
      totalExpenseQuery.andWhere('cashFlow.date >= :startDate', { startDate });
    }

    if (endDate) {
      totalIncomeQuery.andWhere('cashFlow.date <= :endDate', { endDate });
      totalExpenseQuery.andWhere('cashFlow.date <= :endDate', { endDate });
    }

    if (periodDate) {
      totalIncomeQuery.andWhere('cashFlow.date >= :periodDate', { periodDate });
      totalExpenseQuery.andWhere('cashFlow.date >= :periodDate', { periodDate });
    }

    query.orderBy('cashFlow.date', 'DESC');
    const data = await query.getMany();
    const { totalIncome } = (await totalIncomeQuery.getRawOne()) || { totalIncome: 0 };
    const { totalExpense } = (await totalExpenseQuery.getRawOne()) || { totalExpense: 0 };

    return new CashFlowResultDto(data, totalIncome, totalExpense);
  }

  async updateCashFlow(id: string, updateCashFlowDto: UpdateCashFlowDto): Promise<void> {
    await this.update(id, updateCashFlowDto);
  }

  async removeCashFlow(id: string): Promise<void> {
    await this.delete(id);
  }

  async countTotalCashFlows(businessId: string): Promise<number> {
    const count = await this.createQueryBuilder('cashFlow')
      .where('cashFlow.businessProfileId = :businessId', { businessId })
      .getCount();

    return count;
  }
}
