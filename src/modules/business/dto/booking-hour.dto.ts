import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { DaysOfWeek } from '../enum';
import { IsTime } from 'src/decorators';

export class BookingHoursDto {
  @IsEnum(DaysOfWeek, { message: 'invalid day of the week' })
  day: DaysOfWeek;

  @IsOptional()
  @IsTime({ message: 'Time must be in HH:MM format' })
  from: string;

  @IsOptional()
  @IsTime({ message: 'Time must be in HH:MM format' })
  to: string;

  @IsBoolean()
  isClosed: boolean;
}
