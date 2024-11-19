// import {
//   IsEmail,
//   IsIn,
//   IsNotEmpty,
//   IsNumber,
//   IsOptional,
//   IsString,
// } from 'class-validator';
import { Role } from '../enum';

export class RegisterUserDto {
  firstName: string;

  phoneNumber: string;

  lastName: string;

  email: string;

  password: string;

  type: Role;
}
