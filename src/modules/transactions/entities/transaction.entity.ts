import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseTable } from '../../../base';
import { User } from '../../users/entities/user.entity';
import { TransactionStatus } from '../enum/transaction.enum';
import { ServiceDetails } from '../../business/entities';

@Entity({ name: 'transaction' })
export class Transaction extends BaseTable {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 255 })
  transactionRef: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Column({ type: 'simple-json', nullable: true })
  metadata?: Record<string, any>;

  @ManyToOne(() => User, user => user.transactions, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => ServiceDetails, serviceDetails => serviceDetails.transactions, {
    nullable: true,
  })
  @JoinColumn({ name: 'serviceDetailsId' })
  serviceDetails: ServiceDetails;
}
