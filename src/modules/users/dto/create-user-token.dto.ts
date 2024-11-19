import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserFmcDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
