import { PartialType } from '@nestjs/mapped-types';
import { CreateBusinessProfileDto } from './create-business-profile.dto';
import { Point } from 'geojson';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ValidateNested,
} from 'class-validator';
import { BusinessCategory, Currency } from '../enum';
import { Type } from 'class-transformer';
import { UpdateBusinessHoursDto } from './update-booking-hour.dto';

export class UpdateBusinessProfileDto extends PartialType(CreateBusinessProfileDto) {
  @IsOptional()
  coordinates?: Point;

  @IsOptional()
  paymentInformation?: {
    country?: string;
    currencyType?: string;
    bankName?: string;
    accountNumber?: string;
  };

  @IsOptional()
  contactInformation?: {
    email?: string;
    phoneNumber?: string;
    instagramLink?: string;
    facebookLink?: string;
    twitterLink?: string;
    tiktokLink?: string;
  };

  @IsOptional()
  @IsString()
  @Length(0, 100)
  country?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  state?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  city?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  zipCode?: string;

  @IsOptional()
  @IsUrl()
  businessLogo?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsUrl({}, { each: true })
  businessImage?: string[];

  @IsOptional()
  @IsString()
  @Length(1, 100)
  businessName?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(BusinessCategory, { each: true })
  businessCategory: BusinessCategory[];

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateBusinessHoursDto)
  openingHours?: UpdateBusinessHoursDto[];

  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;
}
