import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDTO {
  code: string;
}
