import { IsString, IsDateString, IsNotEmpty, IsInt, Min } from 'class-validator';
import { IsTime } from 'src/decorators';

export class CreateAvailabilityDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsTime({ message: 'Time must be in HH:MM format' })
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsTime({ message: 'Time must be in HH:MM format' })
  @IsNotEmpty()
  @IsString()
  endTime: string;

  @IsInt()
  @Min(1)
  interval: number;
}
