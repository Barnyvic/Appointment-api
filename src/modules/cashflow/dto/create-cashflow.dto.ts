import { IsNotEmpty, IsNumber, IsDate, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { CashFlowType } from '../enum/cash-flow-type.enum';

export class CreateCashFlowDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(CashFlowType)
  type: CashFlowType;
}
