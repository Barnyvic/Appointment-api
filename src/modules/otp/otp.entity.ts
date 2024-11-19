import { Column, Entity } from 'typeorm';
import { NotificationType } from '../../interfaces';
import { BaseTable } from '../../base';

@Entity({ name: 'otp' })
export class Otp extends BaseTable {
  @Column({ type: 'varchar', length: 50, nullable: true })
  userIdentifier: string;

  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  @Column({ type: 'varchar', length: 6 })
  code: string;

  @Column({ type: 'timestamp' })
  expirationDate: Date;

  @Column({ type: 'varchar', length: 50 })
  type: NotificationType;
}
