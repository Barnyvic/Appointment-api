import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { HttpResponse } from 'src/utils';
import { User } from 'src/decorators';
import { AuthGuard } from 'src/guards';
import { IUser } from 'src/interfaces';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // Get all transactions for a user
  @Get('/user-transactions')
  @UseGuards(AuthGuard)
  async findUserTransactions(
    @User() user: IUser,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('amount') amount?: string
  ) {
    const amountNumber = Number(amount);
    const data = await this.transactionsService.findUserTransactions(
      user.id,
      startDate,
      endDate,
      amountNumber
    );
    return HttpResponse.success({
      data,
      message: 'Transactions retrieved successfully',
    });
  }
}
