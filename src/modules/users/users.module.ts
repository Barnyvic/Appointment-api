import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from 'src/typeorm-extension';
import { UsersRepository } from './user.repository';
import { Otp } from '../otp/otp.entity';
import { BusinessModule } from '../business/business.module';
import { UserFcmTokenRepository } from './fmc-token.repository';
import { UserFcmTokenService } from './fmc-token.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UsersRepository, UserFcmTokenRepository]),
    TypeOrmModule.forFeature([Otp]),
    forwardRef(() => BusinessModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserFcmTokenService],
  exports: [UsersService, UserFcmTokenService],
})
export class UsersModule {}
