import { IsNotEmpty, IsDateString, IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { IsTime } from 'src/decorators';

export class BookAppointmentDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsTime({ message: 'Time must be in HH:MM format' })
  startTime: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  customerName?: string;

  @IsOptional()
  @IsEmail()
  @Length(1, 255)
  customerEmail?: string;

  @IsOptional()
  @IsString()
  @Length(10, 20)
  customerPhoneNumber?: string;
}
