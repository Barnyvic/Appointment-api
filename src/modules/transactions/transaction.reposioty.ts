import { CustomRepository } from 'src/typeorm-extension';
import { Repository } from 'typeorm';
import { User } from '../users/entities';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionStatus } from './enum/transaction.enum';
import { Transaction } from './entities/transaction.entity';
import { ServiceDetails } from '../business/entities';

@CustomRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
  async createTransaction(
    user: User,
    service: ServiceDetails,
    createTransactionDto: CreateTransactionDto
  ): Promise<Transaction> {
    const transaction = this.create({
      ...createTransactionDto,
      user,
      serviceDetails: service,
      status: TransactionStatus.PENDING,
    });
    return this.save(transaction);
  }

  async findTransactionByReference(transactionRef: string): Promise<Transaction | undefined> {
    return this.findOne({
      where: { transactionRef },
      relations: ['user'],
    });
  }

  async findTransactionByUserId(userId: string): Promise<Transaction[] | undefined> {
    return this.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async updateTransactionStatus(
    transactionRef: string,
    status: TransactionStatus
  ): Promise<Transaction> {
    const transaction = await this.findTransactionByReference(transactionRef);
    if (transaction) {
      transaction.status = status;
      return this.save(transaction);
    }
    throw new Error(`Transaction with reference ${transactionRef} not found.`);
  }

  async findUserTransactions(
    userId: string,
    startDate?: string,
    endDate?: string,
    amount?: number
  ): Promise<Transaction[]> {
    const query = this.createQueryBuilder('transaction')
      .where('transaction.userId = :userId', { userId })
      .leftJoinAndSelect('transaction.serviceDetails', 'serviceDetails');

    if (startDate) {
      query.andWhere('transaction.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('transaction.createdAt <= :endDate', { endDate });
    }

    if (amount) {
      query.andWhere('transaction.amount = :amount', { amount });
    }

    return await query.getMany();
  }
}
