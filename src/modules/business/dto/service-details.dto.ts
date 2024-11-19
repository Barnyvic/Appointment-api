import {
  IsString,
  IsNumber,
  IsEnum,
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { Currency } from '../enum';

export class ServiceDetailsDto {
  @IsString()
  serviceName: string;

  @IsString()
  serviceType: string;

  @IsNumber()
  timeHours: number;

  @IsNumber()
  timeMinutes: number;

  @IsString()
  amount: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(Currency)
  currency: Currency;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsUrl({}, { each: true })
  image?: string[];
}
