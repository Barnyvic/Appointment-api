import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDetailsDto } from './create-service-details';

export class UpdateServiceDetailsDto extends PartialType(CreateServiceDetailsDto) {}
