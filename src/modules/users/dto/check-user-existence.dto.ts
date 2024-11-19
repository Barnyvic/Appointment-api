import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CheckUserExistenceDto {
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  emailAddress?: string;

  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  phoneNumber?: string;
}
