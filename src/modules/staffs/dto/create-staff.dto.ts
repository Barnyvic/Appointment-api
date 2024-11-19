import { Exclude } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  ArrayNotEmpty,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreateStaffDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  emailAddress: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Exclude({ toPlainOnly: true })
  password?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  serviceIds: string[];
}
