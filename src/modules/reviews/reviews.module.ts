import { forwardRef, Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ReviewRepository } from './reviews.repository';
import { TypeOrmExModule } from 'src/typeorm-extension';
import { BusinessModule } from '../business/business.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([ReviewRepository]),
    forwardRef(() => UsersModule),
    forwardRef(() => BusinessModule),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
