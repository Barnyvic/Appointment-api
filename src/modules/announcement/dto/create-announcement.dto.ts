import { IsString, IsNotEmpty, IsOptional, IsDateString, IsArray } from 'class-validator';

export class CreateAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  publishDate: Date;

  @IsOptional()
  @IsDateString()
  validUntil?: Date;

  @IsOptional()
  @IsArray()
  images?: string[];
}
