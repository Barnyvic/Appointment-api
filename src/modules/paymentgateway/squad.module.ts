import { Module } from '@nestjs/common';
import { SquadService } from './squad.service';
import { SquadController } from './squad.controller';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [TransactionsModule],
  controllers: [SquadController],
  providers: [SquadService],
  exports: [SquadService],
})
export class SquadModule {}
