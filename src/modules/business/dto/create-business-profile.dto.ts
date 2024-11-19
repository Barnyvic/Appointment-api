import { IsString, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceDetailsDto } from './service-details.dto';
import { BookingHoursDto } from './booking-hour.dto';
import { BusinessCategory, ServiceOffering, TeamSize } from '../enum';

export class CreateBusinessProfileDto {
  @IsString()
  businessName: string;

  @IsString()
  businessAddress: string;

  @IsArray()
  @IsEnum(ServiceOffering, { each: true })
  serviceOffering: ServiceOffering[];

  @IsEnum(TeamSize)
  teamSize: TeamSize;

  @IsArray()
  @IsEnum(BusinessCategory, { each: true })
  businessCategory: BusinessCategory[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceDetailsDto)
  services: ServiceDetailsDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingHoursDto)
  bookingHours: BookingHoursDto[];
}
