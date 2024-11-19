import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class RescheduleAppointmentDto {
  @IsNotEmpty()
  @IsDateString()
  newDate: string;

  @IsNotEmpty()
  @IsString()
  newStartTime: string;
}
