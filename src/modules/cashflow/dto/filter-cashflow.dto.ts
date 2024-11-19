import { IsOptional, IsDate, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { CashFlowPeriod, CashFlowType } from '../enum/cash-flow-type.enum';

export class FilterCashflowDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsIn(Object.values(CashFlowType))
  type?: CashFlowType;

  @IsOptional()
  @IsIn(Object.values(CashFlowPeriod))
  period?: CashFlowPeriod;
}
