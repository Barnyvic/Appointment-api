import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ErrorHelper } from 'src/utils';
import { TransactionRepository } from './transaction.reposioty';
import { UsersService } from '../users/users.service';
import { Transaction } from './entities/transaction.entity';
import { ServiceDetailsService } from '../business/services/serviceDetails.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly usersService: UsersService,
    private readonly serviceDetailsService: ServiceDetailsService
  ) {}

  async createTransaction(
    userId: string,
    createTransactionDto: CreateTransactionDto
  ): Promise<Transaction> {
    const { serviceId, ...rest } = createTransactionDto;

    const [user, service] = await Promise.all([
      this.usersService.getUserById(userId),
      this.serviceDetailsService.getServiceDetailsById(serviceId),
    ]);

    if (!user) {
      ErrorHelper.NotFoundException(`User with ID "${userId}" not found`);
    }

    if (!service) {
      ErrorHelper.NotFoundException(`Service with ID "${serviceId}" not found`);
    }

    const transaction = await this.transactionRepository.createTransaction(user, service, rest);

    return transaction;
  }

  async findUserTransactions(
    userId: string,
    startDate?: string,
    endDate?: string,
    amount?: number
  ): Promise<Transaction[]> {
    return this.transactionRepository.findUserTransactions(userId, startDate, endDate, amount);
  }
  async updateTransactionStatus(
    transactionRef: string,
    updateTransactionDto: UpdateTransactionDto
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.updateTransactionStatus(
      transactionRef,
      updateTransactionDto.status
    );

    if (!transaction) {
      ErrorHelper.NotFoundException(`Transaction with reference ${transactionRef} not found`);
    }

    return transaction;
  }

  async removeTransaction(id: string): Promise<void> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      ErrorHelper.NotFoundException(`Transaction with ID ${id} not found`);
    }

    await this.transactionRepository.remove(transaction);
  }

  public async findUserById(userId: string): Promise<Transaction[]> {
    return await this.transactionRepository.findTransactionByUserId(userId);
  }
}
