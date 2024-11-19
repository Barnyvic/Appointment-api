import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Role } from '../enum';
import { Type } from 'class-transformer';
import { CreateBusinessProfileDto } from '../../business/dto/create-business-profile.dto';
import { IsValidBirthdate } from '../../../decorators/datestring.decorator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  emailAddress: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsValidBirthdate()
  birthdate?: string;

  @IsString()
  @IsIn(['USER', 'SERVICE_PROVIDER', 'ADMIN'])
  @IsNotEmpty()
  role: Role;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateBusinessProfileDto)
  businessProfile?: CreateBusinessProfileDto;
}
