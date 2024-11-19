import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
// import { TaskStatusType } from '../../order/entities/delivery_task.entity';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}
export class PaginationDto {
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.DESC;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
