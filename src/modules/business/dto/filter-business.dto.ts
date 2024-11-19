import {
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
  IsString,
} from 'class-validator';
import { BusinessCategory } from '../enum';
import { Transform } from 'class-transformer';

export class FilterBusinessesDto {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(BusinessCategory, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  categories?: BusinessCategory[];

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  @Transform(({ value }) => parseFloat(value))
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  @Transform(({ value }) => parseFloat(value))
  longitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  maxDistance?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  @Transform(({ value }) => parseFloat(value))
  minRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  @Transform(({ value }) => parseFloat(value))
  maxRating?: number;

  @IsOptional()
  @IsString()
  searchQuery?: string;
}
