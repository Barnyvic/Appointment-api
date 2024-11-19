import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmExModule } from 'src/typeorm-extension';
import { TransactionRepository } from './transaction.reposioty';
import { UsersModule } from '../users/users.module';
import { BusinessModule } from '../business/business.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([TransactionRepository]),
    UsersModule,
    BusinessModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
