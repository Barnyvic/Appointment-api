import { TransactionStatus } from '../enum/transaction.enum';

export class CreateTransactionDto {
  amount: number;
  email: string;
  transactionRef?: string;
  status?: TransactionStatus;
  metadata?: Record<string, any>;
  serviceId?: string;
}
