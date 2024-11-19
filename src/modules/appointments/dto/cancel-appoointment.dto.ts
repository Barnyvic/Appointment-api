import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CancelAppointmentDto {
  @IsString()
  @MaxLength(255)
  reasonForCancellation?: string;
}
