import { Entity, Column, ManyToOne } from 'typeorm';
import { BusinessProfile } from '../../../modules/business/entities';
import { BaseTable } from '../../../base';
import { CashFlowType } from '../enum/cash-flow-type.enum';

@Entity({ name: 'cashflow' })
export class CashFlow extends BaseTable {
  @Column({ type: 'varchar', length: 50 })
  title: string;

  @Column()
  amount: number;

  @Column()
  date: Date;

  @Column()
  description: string;

  @Column({ type: 'varchar', default: CashFlowType.INCOME })
  type: CashFlowType;

  @ManyToOne(() => BusinessProfile, businessProfile => businessProfile.cashFlows)
  businessProfile: BusinessProfile;
}
