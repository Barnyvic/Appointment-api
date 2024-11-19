import { BaseTable } from '../../../base';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BusinessProfile } from './business.entity';

@Entity({ name: 'paymentInformation' })
export class PaymentInformation extends BaseTable {
  @Column({ type: 'varchar', length: 100 })
  country: string;

  @Column({ type: 'varchar', length: 50 })
  currencyType: string;

  @Column({ type: 'varchar', length: 100 })
  bankName: string;

  @Column({ type: 'varchar', length: 100 })
  accountNumber: string;

  @OneToOne(() => BusinessProfile, businessProfile => businessProfile.paymentInformation)
  @JoinColumn()
  businessProfile: BusinessProfile;
}
