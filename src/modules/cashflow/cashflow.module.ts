import { Module } from '@nestjs/common';
import { CashflowController } from './cashflow.controller';
import { CashFlowService } from './cashflow.service';
import { TypeOrmExModule } from 'src/typeorm-extension';
import { CashFlowRepository } from './repository/cashfllow.repository';
import { BusinessModule } from '../business/business.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([CashFlowRepository]), BusinessModule],
  providers: [CashFlowService],
  controllers: [CashflowController],
  exports: [CashFlowService],
})
export class CashflowModule {}
