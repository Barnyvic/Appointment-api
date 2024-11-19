import { IsEnum, IsOptional, IsString, IsBoolean, IsUUID } from 'class-validator';
import { DaysOfWeek } from '../enum';

export class UpdateBusinessHoursDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsEnum(DaysOfWeek, { message: 'Invalid day of the week' })
  day?: DaysOfWeek;

  @IsOptional()
  @IsString({ message: 'Time must be in HH:MM format' })
  from?: string;

  @IsOptional()
  @IsString({ message: 'Time must be in HH:MM format' })
  to?: string;

  @IsOptional()
  @IsBoolean({ message: 'Invalid value for isClosed' })
  isClosed?: boolean;
}
