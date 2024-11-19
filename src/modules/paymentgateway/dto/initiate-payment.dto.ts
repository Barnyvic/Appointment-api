import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class InitiatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsUUID()
  @IsNotEmpty()
  serviceId: string;

  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  reference: string;
}
