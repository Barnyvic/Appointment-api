import {
  IsOptional,
  IsUUID,
  IsArray,
  ArrayNotEmpty,
  IsString,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class UpdateStaffDto {
  @IsOptional()
  @IsUUID()
  businessProfileId?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  serviceIds?: string[];
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  emailAddress?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phoneNumber?: string;
}
